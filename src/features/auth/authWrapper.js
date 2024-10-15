// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { jwtDecode } from "jwt-decode";
// import { logout } from './authSlice';
// import { fetchPomodoroSettings } from '../Pomodoro/pomodoroSlice';

// export function useAuthCheck() {
//   const { user } = useSelector((state) => state.auth);
//   const { settingsId, isLoading, error } = useSelector((state) => state.pomodoro);
//   const dispatch = useDispatch();
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [settingsFetched, setSettingsFetched] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const storedUser = JSON.parse(localStorage.getItem('user'));

//       if (!storedUser || !storedUser.access) {
//         dispatch(logout());
//         setIsAuthenticated(false);
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(storedUser.access);
//         const currentTime = Date.now() / 1000; 

//         if (decodedToken.exp < currentTime) {
//           dispatch(logout());
//           setIsAuthenticated(false);
//         } else {
//           setIsAuthenticated(true);
//           if (!settingsFetched && !isLoading && error === null) {
//             await dispatch(fetchPomodoroSettings());
//             setSettingsFetched(true);
//           }
//         }
//       } catch (error) {
//         console.error('Error decoding JWT:', error);
//         dispatch(logout());
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, [user, dispatch, settingsFetched, isLoading, error]);

//   return isAuthenticated;
// }