export const ROUTES = {
  // Auth routes
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Public routes 
  HOME: '/',
  JOBS: '/jobs',
  COMPANIES:{
    BASE: '/companies',
    DETAIL: (id) => `/companies/${id}`,
  } 
};