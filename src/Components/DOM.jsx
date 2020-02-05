import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'


import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkActor           from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCalculator      from 'vtk.js/Sources/Filters/General/Calculator';
import vtkConeSource      from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper          from 'vtk.js/Sources/Rendering/Core/Mapper';
import { AttributeTypes } from 'vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants';
import { FieldDataTypes } from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';

import controlPanel from './controller.html';


class DOM extends Component {

    componentDidMount(){
      
const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();


const coneSource = vtkConeSource.newInstance({ height: 1.0 });
const filter = vtkCalculator.newInstance();

filter.setInputConnection(coneSource.getOutputPort());
filter.setFormula({
  getArrays: inputDataSets => ({
    input: [],
    output: [
      { location: FieldDataTypes.CELL, name: 'Random', dataType: 'Float32Array', attribute: AttributeTypes.SCALARS },
    ],
  }),
  evaluate: (arraysIn, arraysOut) => {
    const [scalars] = arraysOut.map(d => d.getData());
    for (let i = 0; i < scalars.length; i++) {
      scalars[i] = Math.random();
    }
  },
});
// ----------------------------------------------------------------------------
// Console Zone
console.log('filter', filter);
// ----------------------------------------------------------------------------

const mapper = vtkMapper.newInstance();
mapper.setInputConnection(filter.getOutputPort());

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

renderer.addActor(actor);
renderer.resetCamera();
// renderWindow.setContainer(querySelector('.container'))
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);
const representationSelector = document.querySelector('.representations');
const resolutionChange = document.querySelector('.resolution');

representationSelector.addEventListener('change', (e) => {
  const newRepValue = Number(e.target.value);
  actor.getProperty().setRepresentation(newRepValue);
  renderWindow.render();
});

resolutionChange.addEventListener('input', (e) => {
  const resolution = Number(e.target.value);
  coneSource.setResolution(resolution);
  renderWindow.render();

  const {dispatch} = this.props
  dispatch({
    type: 'submit',
    value: resolution
  })
  console.log(this.props.value);
});
    }

    render(){
        return(
          //企图设置DOM容器来load vtk图像
          <div className="container"></div>
        )
    }
}

export default connect(state=>{
  return {
    value: state
  }
})(DOM);
