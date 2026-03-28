import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import { BrowserRouter } from 'react-router-dom';
import { insforge } from './lib/insforge';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InsforgeProvider client={insforge}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InsforgeProvider>
  </StrictMode>
);
