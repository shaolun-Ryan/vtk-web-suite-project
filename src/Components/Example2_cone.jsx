import React, { Component } from 'react'

import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import ConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';

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

    global.cone = cone
    global.ConeSource = ConeSource
  }

  render(){
    return null
  }
}

export default DOM