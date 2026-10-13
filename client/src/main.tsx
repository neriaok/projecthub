import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import App from './App';
import { appTheme } from './theme';
import { store } from './store/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <FluentProvider theme={appTheme} dir="rtl">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FluentProvider>
    </Provider>
  </StrictMode>,
);
