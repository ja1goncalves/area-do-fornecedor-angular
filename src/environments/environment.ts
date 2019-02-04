import { config } from '../config';

export const environment = {
  production: config.production,
  NODE_ENV: config.NODE_ENV,
  API_URL: config.API_URL,
  NOTIFY_URL: config.NOTIFY_URL,
  GRANT_TYPE : config.GRANT_TYPE,
  CLIENT_SECRET : config.CLIENT_SECRET,
  CLIENT_ID : config.CLIENT_ID,
  scope : config.scope
};
