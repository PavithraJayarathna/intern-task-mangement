
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-blue-300 mb-6">404</h1>
        <p className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <Button className="w-full">
              {isAuthenticated ? "Back to Dashboard" : "Go to Home"}
            </Button>
          </Link>
          
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
