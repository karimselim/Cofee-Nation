import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../setup/context/user-auth-context";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, ready } = useUserAuth();
  if (!ready) return null;
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default ProtectedRoute;
