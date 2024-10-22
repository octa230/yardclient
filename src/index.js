import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { StoreProvider } from './Store';


axios.defaults.baseURL = 'https://api.ugyard.com'
const root = createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
      <GoogleOAuthProvider clientId="298088274300-bgakunqf5tgofo393k5clg179hd7uj3l.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
