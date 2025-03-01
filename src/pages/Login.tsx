import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success('Successfully logged in!');
      navigate('/domain-selection');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Firebase Error:', {
          code: error.code,
          message: error.message,
          details: error
        });
        
        // Show more specific error messages
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toast.error('Sign-in cancelled. Please try again.');
            break;
          case 'auth/popup-blocked':
            toast.error('Popup was blocked. Please allow popups for this site.');
            break;
          case 'auth/unauthorized-domain':
            toast.error('This domain is not authorized for Google sign-in. Please contact the administrator.');
            break;
          default:
            toast.error(`Failed to log in: ${error.message}`);
        }
      } else {
        console.error('Non-Firebase Error:', error);
        // Check for our custom error about email domain
        if (error instanceof Error && error.message.includes('@vitstudent.ac.in')) {
          toast.error('Only @vitstudent.ac.in email addresses are allowed');
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">
            iQuest
          </h1>
          <h2 className="text-2xl font-bold text-white-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to continue your journey
          </p>
        </div>
        
        <div className="terminal-box p-8 animate-fade-in border-2 border-terminal-border">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-terminal-bg rounded-full flex items-center justify-center border border-terminal-highlight">
                <svg 
                  className="w-8 h-8 text-terminal-highlight" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
                  />
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-terminal-highlight">
                Sign in with Google
              </h3>
              <p className="mt-1 text-sm text-terminal-text">
                Use your Google account to access all features
              </p>
              <div className="mt-3 p-2 bg-terminal-highlight/10 border border-terminal-highlight/30 rounded">
                <p className="text-sm text-terminal-highlight font-mono">
                  <span className="text-yellow-400">⚠️ IMPORTANT:</span> Only emails with <span className="font-bold">@vitstudent.ac.in</span> domain are allowed
                </p>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-terminal-bg border-2 border-terminal-highlight text-terminal-highlight font-mono py-3 flex justify-center items-center gap-3 transition-all hover:bg-terminal-highlight hover:text-terminal-bg focus:outline-none focus:ring-2 focus:ring-terminal-highlight focus:ring-opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  <span className="terminal-prompt font-mono">Sign in with Google</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-terminal-highlight hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-terminal-highlight hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 