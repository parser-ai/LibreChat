import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { createRoot } from 'react-dom/client';
import 'regenerator-runtime/runtime';
import App from './App';
import { msalConfig } from './components/authTemp/config';
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';
import './mobile.css';
import './style.css';

const container = document.getElementById('root');
const root = createRoot(container);

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

root.render(
  <ApiErrorBoundaryProvider>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </ApiErrorBoundaryProvider>,
);
