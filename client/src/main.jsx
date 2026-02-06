import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import './app.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}    
    authorizationParams={{
      redirect_uri: window.location.origin,
      // 👇 AQUÍ ESTABA EL ERROR: Ahora leerá del archivo .env
      audience: import.meta.env.VITE_AUTH0_AUDIENCE, 
      scope: "openid profile email read:current_user update:current_user_metadata write:orders"
    }}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);