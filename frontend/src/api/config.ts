export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      ME: '/auth/me/',
      LOGOUT: '/auth/logout/',
    },
    PRESCRIPTIONS: {
      LIST: '/prescriptions/',
      DETAIL: (id: string) => `/prescriptions/${id}/`,
      CREATE: '/prescriptions/',
      UPDATE: (id: string) => `/prescriptions/${id}/`,
      DELETE: (id: string) => `/prescriptions/${id}/`,
    },
    USERS: {
      PROFILE: '/users/profile/',
      UPDATE_PROFILE: '/users/profile/',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
}; 