import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

declare global {
  interface Window {
    handleGoogleAuth?: (response: { credential: string }) => void;
  }
}

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 🔽 Place your useEffect here inside the Login component
  useEffect(() => {
    window.handleGoogleAuth = async (response) => {
      setIsGoogleLoading(true);
      try {
        if (!response.credential) throw new Error('No credential received from Google');
        const decoded = jwtDecode(response.credential);
        console.log('Google login/signup successful', decoded);
        await login(response.credential);
        toast.success('Login successful');
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Login failed. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    };

    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: window.handleGoogleAuth
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          type: 'standard',
          size: 'large',
          theme: 'outline',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignUpButton'),
        {
          type: 'standard',
          size: 'large',
          theme: 'filled_blue',
          text: 'signup_with',
          shape: 'pill'
        }
      );
    }

    return () => {
      delete window.handleGoogleAuth;
    };
  }, [login]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-4xl font-extrabold text-center text-primary-blue-300">
            TaskMaster
          </h1>
          <p className="mb-8 text-xl text-center text-gray-600">
            Streamline your tasks, boost your productivity
          </p>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in or Sign up to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div id="googleSignInButton"></div>
                <div id="googleSignUpButton"></div>

                {isGoogleLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-blue-200 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
