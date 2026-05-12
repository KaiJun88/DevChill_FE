import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../utils/auth";

export default function ProtectedRoute({ roles }) {
  const token = getAccessToken();
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    // eslint-disable-next-line react-hooks/error-boundaries
    if (!roles.includes(decoded.role)) return <Navigate to="/" replace />;
    // eslint-disable-next-line react-hooks/error-boundaries
    return <Outlet />;
  } catch {
    return <Navigate to="/" replace />;
  }
}
