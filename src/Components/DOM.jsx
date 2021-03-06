import React, { Component } from 'react'
import ModalDialog from 'react-bootstrap/ModalDialog'
import Modal from 'react-bootstrap/Modal'


import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import ConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
import vtkFullDOMRenderWindow from '../library/FullDOMRenderer';

class DOM extends Component{

  componentDidMount(){
    const cone = ConeSource.newInstance({ height: 2, radius: 1, resolution: 8, capping: false, direction: [0,1,0]})
    const mapper = vtkMapper.newInstance()
    const actor = vtkActor.newInstance()

    mapper.setInputConnection(cone.getOutputPort())
    actor.setMapper(mapper)

    const fullDOMRenderer = vtkFullDOMRenderWindow.newInstance()
    const renderer = fullDOMRenderer.getRenderer()
    renderer.addActor(actor)
    renderer.resetCamera()

    const rendererWindow = fullDOMRenderer.getRenderWindow()
    rendererWindow.render()

    global.cone = cone
    global.ConeSource = ConeSource
    global.fullDOMRenderer = fullDOMRenderer
  }

  render(){
    return (
        //centered的属性的作用没有体现出来
        <ModalDialog centered={false}>
            <Modal.Header closeButton>
                <Modal.Title>VTK Simulation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="dom-div"></div>
            </Modal.Body>
        </ModalDialog>
    )
  }
}

export default DOM