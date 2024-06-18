import './index.css';
import React from "react";
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux';
import App from "./App";
import { store } from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const el = document.getElementById("root");
const root = createRoot(el);

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

// console.log("LMAO");
// console.log("Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);



root.render(

    

    <Provider store={store}>

        <App />

    </Provider>
    

);
