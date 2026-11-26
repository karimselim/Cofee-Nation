import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../setup/context/user-auth-context";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  let { user } = useUserAuth();
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default ProtectedRoute;
