import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;