import { Outlet, Navigate } from "react-router"
import { jwtDecode } from 'jwt-decode'

export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const isTokenValid = () => {
    if (!token) return false;
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (decoded.exp <= currentTime) {
      localStorage.removeItem('token');
      return false;
    }


    return true;
  };


  return isTokenValid() ? <Outlet /> : <Navigate to="/" />;
};


export default ProtectedRoute;