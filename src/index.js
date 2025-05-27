import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";
import {Provider} from "react-redux";
import axios from "axios";

import "./styles/all.scss";
import App from './App';
import { store } from './store';


axios.defaults.baseURL = process.env.REACT_APP_API_URL;  //預設的URL

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Router>
			<Provider store={store}>
				<App />
			</Provider>
		</Router>
	</React.StrictMode>
);
