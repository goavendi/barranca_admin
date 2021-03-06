import React from 'react';
import ReactDOM from 'react-dom';
import Pusher from "pusher-js";
import {BrowserRouter as Router} from 'react-router-dom'

import App from './App';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { StateProvider } from "./context/context";
import reducer, { initialState } from "./context/reducer";

const pusher = new Pusher("dd973fb6b3feeb4df833", {
  cluster: "ap2",
});

ReactDOM.render(
  <React.StrictMode>
  	<StateProvider initialState={initialState}
        pusher={pusher}
        reducer={reducer}>
  		<Router>
    	<App />
    	</Router>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();