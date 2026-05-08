import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;