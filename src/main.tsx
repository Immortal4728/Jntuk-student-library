import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { InsforgeProvider } from '@insforge/react';
import { BrowserRouter } from 'react-router-dom';
import { insforge } from './lib/insforge';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <InsforgeProvider client={insforge}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InsforgeProvider>
    </HelmetProvider>
  </StrictMode>
);
