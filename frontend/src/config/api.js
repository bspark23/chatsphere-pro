// API Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    socketUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://your-backend.vercel.app/api',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'https://your-backend.vercel.app'
  }
};

const env = import.meta.env.MODE || 'development';

export const API_URL = config[env].apiUrl;
export const SOCKET_URL = config[env].socketUrl;

export default config[env];
