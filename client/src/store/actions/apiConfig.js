/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

const prodUrl = 'https://co-ment.glitch.me';
//const devUrl  = 'https://co-ment-dev.glitch.me';
const devUrl  = 'http://127.0.0.1:3001';


/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT
export const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);
