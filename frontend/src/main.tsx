import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

// Configuração do mock para desenvolvimento
import { setupMockInterceptor } from './services/mockInterceptor';

const isDevelopment = import.meta.env.DEV;
const useMock = import.meta.env.VITE_USE_MOCK === 'true' || isDevelopment;

if (useMock) {
  console.log('🎭 Modo mock ativado - dados simulados serão utilizados');
  setupMockInterceptor();
}

// Verifica o tema do sistema e aplica a classe apropriada
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Registra o Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
