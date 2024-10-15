/*import axios from 'axios';

const BACKEND_DOMAIN = 'http://192.168.1.39:5173';

const api = axios.create({
    baseURL: BACKEND_DOMAIN,
     headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
     const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access) {
       config.headers['Authorization'] = `JWT ${user.access}`;
     }
    return config;
  },
   (error) => Promise.reject(error) );

 api.interceptors.response.use(
   (response) => response,
   async (error) => {
     const originalRequest = error.config;
     if (error.response.status === 401 && !originalRequest._retry) {
       originalRequest._retry = true;
       try {
         const refreshToken = JSON.parse(localStorage.getItem('user'))?.refresh;
         const response = await api.post('/api/v1/auth/jwt/refresh/', { refresh: refreshToken });
         const user = JSON.parse(localStorage.getItem('user'));
         user.access = response.data.access;
         localStorage.setItem('user', JSON.stringify(user));
         originalRequest.headers['Authorization'] = `JWT ${response.data.access}`;
         return api(originalRequest);
       } catch (refreshError) {
         return Promise.reject(refreshError);
       }
     }
     return Promise.reject(error);
   }
 );

 export default api; */