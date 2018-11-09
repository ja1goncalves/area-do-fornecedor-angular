import { config } from '../config';

export const environment = {
  production: config.production,
  NODE_ENV: config.NODE_ENV,
  API_URL: config.API_URL,
};
