import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "@/scss/global.scss";
import { useEffect } from 'react';
import { AuthProvider,ReporteProvider } from '../contexts/index';
import {AuthGuard} from '../components/Auth/AuthGuard';
import { initializeDemoApi } from '@/mocks/demoApi';

config.autoAddCss = false;

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializeDemoApi();
  }, []);

  return (
    <AuthProvider>
      <ReporteProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </ReporteProvider>
    </AuthProvider>
  );
}