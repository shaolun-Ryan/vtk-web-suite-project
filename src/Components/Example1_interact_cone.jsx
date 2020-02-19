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


      const coneSource = vtkConeSource.newInstance({ height: 1.0,resolution: 8 });
      const filter = vtkCalculator.newInstance();

      console.log('filter', filter.getFormula().getArrays());


      filter.setInputConnection(coneSource.getOutputPort());
      filter.setFormula({
        getArrays: inputDataSets => ({
          input: [],
          output: [
            { location: FieldDataTypes.CELL, name: 'Random', dataType: 'Float32Array', attribute: AttributeTypes.SCALARS },
          ],
        }),
        evaluate: (arraysIn, arraysOut) => {
          //getData()
          //filter.getOutputData().getCellData().getScalars().getData()
          console.log(arraysOut[0].getData());
            
          //const [scalars] 最后返回的scalars是一个Float32Array对象
          //const scalars 返回的是一个以上述元素为元素的一个数组
          //
          //下面的一行code等价于const [a] = [filter.getOutputData().getCellData().getScalars()].map(d=>d.getData())
          //即arrayOut等价于[filter.getOutputData().getCellData().getScalars()]
          //可能是只有一个model的关系，如果是多个model的话可能会返回多个
          const [scalars] = arraysOut.map(d => d.getData());
          for (let i = 0; i < scalars.length; i++) {
            scalars[i] = Math.random();
          }
          console.log(arraysOut[0].getData());
        },
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(filter.getOutputPort());

      // ----------------------------------------------------------------------------
      // Console Zone
      // console.log('cone :', filter);
      // console.log('cone', filter.getOutputPort()() );
      // ----------------------------------------------------------------------------

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      renderer.addActor(actor);
      renderer.resetCamera();
      // renderWindow.setContainer(querySelector('.container'))
      renderWindow.render();

      function animate(){

        requestAnimationFrame(animate)
  
        render()
  
      }
  
      function render(){
        actor.rotateX(3)
  
        renderWindow.render()
      }
  
      //开启动画
      animate()

      
      //console controls
      global.coneSource = coneSource
      global.mapper = mapper;
      global.actor = actor;
      global.renderer = renderer;
      global.renderWindow = renderWindow;
      global.filter = filter

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
