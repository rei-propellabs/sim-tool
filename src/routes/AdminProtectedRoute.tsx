import useAuthCheck from "api/hooks/useAuthCheck";
import { usePageTitle } from "hooks/usePageTitle";
import { Navigate, Outlet } from "react-router-dom";
import { clearToken, getToken } from "utils/TokenManager";

const AdminProtectedRoute = () => {
  usePageTitle("Novamera Upload Centre");
  
  const token = getToken("uploadAdmin");
  const { isLoading, user } = useAuthCheck(token)

    if (isLoading) return <div>Loading...</div>;

  if (!token || !user || !user.organization?.isAdmin) {
    clearToken("uploadAdmin");
    return <Navigate to="/admin/auth" replace />;
  }
  return <Outlet />;
};

export default AdminProtectedRoute;