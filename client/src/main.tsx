import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './assets/global.css';
import { IsMobileContextProvider } from './contexts/isMobileContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <IsMobileContextProvider>
        <App />
      </IsMobileContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
