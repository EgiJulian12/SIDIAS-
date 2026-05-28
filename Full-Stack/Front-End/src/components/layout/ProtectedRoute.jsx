import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLogin = localStorage.getItem("sidias_login");

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
