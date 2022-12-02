import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './assets/global.css';
import { IsMobileContextProvider } from './contexts/isMobileContext';
import { AuthContextProvider } from './contexts/authContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <IsMobileContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </IsMobileContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
