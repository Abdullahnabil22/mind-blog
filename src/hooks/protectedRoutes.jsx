import { Navigate, useLocation } from "react-router";
import { useAuth } from "../stores/useAuthStore";
import Loading from "../components/Loading/loading";

export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
  
    if (isLoading) {
      return <Loading/>;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  }