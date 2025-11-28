import axios from 'axios';
import { appEnv } from '@app/config/environment';
import store from '@app/store/store';

axios.defaults.maxRedirects = 0;

// Cloudflare Access headers for dev environment
axios.interceptors.request.use((config) => {
  if (appEnv === 'dev') {
    // Priority 1: Use env vars (dev server with .env.secret)
    let clientId = import.meta.env.VITE_CF_ACCESS_CLIENT_ID;
    let clientSecret = import.meta.env.VITE_CF_ACCESS_CLIENT_SECRET;

    // Priority 2: Use Redux state (build:dev with Settings tab input)
    if (!clientId || !clientSecret) {
      const state = store.getState();
      clientId = state.cfAccess?.clientId;
      clientSecret = state.cfAccess?.clientSecret;
    }

    if (clientId && clientSecret) {
      config.headers['CF-Access-Client-Id'] = clientId;
      config.headers['CF-Access-Client-Secret'] = clientSecret;
    }
  }
  return config;
});
