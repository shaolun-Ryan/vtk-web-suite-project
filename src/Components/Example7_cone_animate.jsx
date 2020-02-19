import React, { Component } from 'react'

import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import ConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import RenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

class DOM extends Component{

  componentDidMount(){
    const cone = ConeSource.newInstance({ height: 2, radius: 1, resolution: 8, capping: false, direction: [0,1,0]})
    const mapper = vtkMapper.newInstance()
    const actor = vtkActor.newInstance()

    mapper.setInputConnection(cone.getOutputPort())
    actor.setMapper(mapper)

    const fullRenderer = vtkFullScreenRenderWindow.newInstance()
    const renderer = fullRenderer.getRenderer()
    renderer.addActor(actor)
    renderer.resetCamera()

    const rendererWindow = fullRenderer.getRenderWindow()
    rendererWindow.render()

    function animate(){

      requestAnimationFrame(animate)

      render()

    }

    function render(){
      actor.rotateY(3)

      rendererWindow.render()
    }

    animate()

    global.cone = cone
    global.coneSource = ConeSource
    global.mapper = mapper
  }

  render(){
    return null
  }
}

export default DOM