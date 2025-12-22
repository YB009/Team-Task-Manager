import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
