import useAuthCheck from "api/hooks/useAuthCheck";
import { usePageTitle } from "hooks/usePageTitle";
import { Navigate, Outlet } from "react-router-dom";
import { clearToken, getToken } from "utils/TokenManager";

const ClientProtectedRoute = () => {
  usePageTitle("Novamera Upload Centre");
  
  const token = getToken("uploadClient");
  const { isLoading, user } = useAuthCheck(token)

  if (isLoading) {
    return null;
  }

  if (!token || !user) {
    clearToken("uploadClient")
    return <Navigate to="/upload/auth" replace />;
  }
  return <Outlet />;
};

export default ClientProtectedRoute;