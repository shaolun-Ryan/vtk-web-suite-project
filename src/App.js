import React, {Component} from 'react'
// import GridLayout from 'react-grid-layout';


import DOM from './Components/DOM.jsx'
import D3 from './Components/D3.jsx'


import '../css/react_grid_layout_styles.css'
import '../css/react_resizable_styles.css'


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
              y: 10, // puts it at the bottom
              w: 3,
              h: 6,
              i: new Date().getTime().toString(),
              type: 'bar'
            }
          ]
        }
      }

  render() {
    return (
        <div>
            <ResponsiveGridLayout className="layout" >
                <div key="3" style={{backgroundColor:'#000'} } data-grid={this.state.widgets[0]}>2</div>
                <div key="4" style={{backgroundColor:'#f05555'} } data-grid={{
                    x: 3,
                    y: 0, // puts it at the bottom
                    w: 3,
                    h: 3,
                    i: new Date().getTime().toString(),
                    type: 'bar'
                    }}></div>
            </ResponsiveGridLayout>
            <DOM/>
      </div>
      
    )
  }
}
export default App;