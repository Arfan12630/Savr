import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createCustomTheme, sageGreenPalette } from './theme/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createCustomTheme(sageGreenPalette);

root.render(
  <StrictMode>
    <CssVarsProvider
      theme={theme}
      disableTransitionOnChange>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>
);

reportWebVitals();
