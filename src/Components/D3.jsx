import React, { Component } from 'react'
import * as d3 from 'd3'
import store from '../store'

class D3 extends Component{
    render(){
        return(
            <div>
    <h1>{store.getState()}</h1>  
            </div>

        )
    }
}

export default D3