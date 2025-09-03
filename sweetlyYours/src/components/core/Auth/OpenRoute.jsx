import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * OpenRoute
 * - Used for routes like Login/Signup
 * - Prevents authenticated users from accessing these pages
 */
function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (token === null) {
    // User is NOT logged in -> Allow access to Login/Signup
    return children;
  } else {
    // User IS logged in -> Redirect to homepage
    return <Navigate to="/" />;
  }
}

export default OpenRoute;
