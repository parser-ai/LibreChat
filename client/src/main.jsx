import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { createRoot } from 'react-dom/client';
import 'regenerator-runtime/runtime';
import App from './App';
import { msalConfig } from './components/Auth/config';
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';
import './mobile.css';
import './style.css';
import MSALHandler from './components/Auth/MSALHandler';

const container = document.getElementById('root');
const root = createRoot(container);

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

root.render(
  <ApiErrorBoundaryProvider>
    <MsalProvider instance={msalInstance}>
      <MSALHandler />
      <App />
    </MsalProvider>
  </ApiErrorBoundaryProvider>,
);
