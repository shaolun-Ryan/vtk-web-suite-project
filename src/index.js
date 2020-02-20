import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import store from './store'

//引入全局样式
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
    <Provider store = {store}>
        <App/>
    </Provider>
, document.getElementById('app'));
