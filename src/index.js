import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Router, Route} from "react-router";

ReactDOM.render(	
  <Router>
		<Route path="/docs/:endpoint" component={App} />
		<Route path="*" component={App} />
	</Router>, document.getElementById('app')
);
