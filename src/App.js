import React, {Component} from 'react'
// import GridLayout from 'react-grid-layout';


import DOM from './Components/DOM.jsx'
import D3 from './Components/D3.jsx'


import '../css/react_grid_layout_styles.css'
import '../css/react_resizable_styles.css'

import 'vtk.js/Sources/favicon';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';


import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          layouts:  {},
          widgets:[
            {
              x: 0,
              y: 0, // puts it at the bottom
              w: 3,
              h: 3,
              i: new Date().getTime().toString(),
              type: 'bar'
            }
          ]
        }
      }

      componentDidMount(){
        // let sample = document.querySelector('#sample')
        // console.log(sample)

        const renderWindow = vtkRenderWindow.newInstance();
const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
renderWindow.addRenderer(renderer);

// ----------------------------------------------------------------------------
// Simple pipeline ConeSource --> Mapper --> Actor
// ----------------------------------------------------------------------------

const coneSource = vtkConeSource.newInstance({ height: 1.0 });

const mapper = vtkMapper.newInstance();
mapper.setInputConnection(coneSource.getOutputPort());

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

// ----------------------------------------------------------------------------
// Add the actor to the renderer and set the camera based on it
// ----------------------------------------------------------------------------

renderer.addActor(actor);
renderer.resetCamera();

// ----------------------------------------------------------------------------
// Use OpenGL as the backend to view the all this
// ----------------------------------------------------------------------------

const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
renderWindow.addView(openglRenderWindow);

// ----------------------------------------------------------------------------
// Create a div section to put this into
// ----------------------------------------------------------------------------


const container = document.createElement('div');
document.querySelector('#sample').appendChild(container);
openglRenderWindow.setContainer(container);

// ----------------------------------------------------------------------------
// Capture size of the container and set it to the renderWindow
// ----------------------------------------------------------------------------

const { width, height } = container.getBoundingClientRect();
// console.log(container.getBoundingClientRect());
openglRenderWindow.setSize(width/2, height/2);

// ----------------------------------------------------------------------------
// Setup an interactor to handle mouse events
// ----------------------------------------------------------------------------

const interactor = vtkRenderWindowInteractor.newInstance();
interactor.setView(openglRenderWindow);
interactor.initialize();
interactor.bindEvents(container);

// ----------------------------------------------------------------------------
// Setup interactor style to use
// ----------------------------------------------------------------------------

interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  
      }

  render() {
    return (
        
            <ResponsiveGridLayout >
                {/* <div key="3" style={{backgroundColor:'#f0f0f0'} } data-grid={this.state.widgets[0]}><D3/></div> */}
                <div key="4" id="sample" data-grid={{
                    x: 3,
                    y: 0, // puts it at the bottom
                    w: 3,
                    h: 5,
                    i: new Date().getTime().toString(),
                    type: 'bar'
                    }}></div>
            </ResponsiveGridLayout>
            // <DOM/>
    )
  }
}
export default App;