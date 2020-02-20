//Cuz this DOM renderer is combined by 5 rendering modules
//Have no idea about why the rendered image is fluzzing
//So this approach is now obsoleted and turned to FullDOMRenderer

import React, { Component } from 'react'

import 'vtk.js/Sources/favicon';

import vtkDOMRenderer from '../library/DOMRenderer'

class DOM extends Component{

    componentDidMount(){

        vtkDOMRenderer()
        
    }

    render(){
        return (
            //用来盛放所有vtk图像的DOM元素dom-div
            <div id="dom-div"></div>
        )
    }
}

export default DOM