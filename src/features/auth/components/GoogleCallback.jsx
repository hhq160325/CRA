import { useEffect, useState } from 'react';

const GoogleCallback = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Parse URL parameters to get auth data from backend
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get all possible auth data from URL
    const token = urlParams.get('token') || urlParams.get('JwtToken');
    const email = urlParams.get('email') || urlParams.get('Email');
    const username = urlParams.get('username') || urlParams.get('Username');
    const refreshToken = urlParams.get('refreshToken') || urlParams.get('RefreshToken');
    const errorMsg = urlParams.get('error');

    // console.log('GoogleCallback: Received data from backend', {
    //   hasToken: !!token,
    //   hasEmail: !!email,
    //   hasError: !!errorMsg,
    //   hasOpener: !!window.opener
    // });

    // Check if there's an error
    if (errorMsg) {
      console.error('GoogleCallback: Error from backend:', errorMsg);
      setError(errorMsg);
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ error: errorMsg }, window.location.origin);
        }
        window.close();
      }, 2000);
      return;
    }

    // Check if we have the required auth data
    if (!token) {
      console.error('GoogleCallback: No token received from backend');
      setError('No authentication token received');
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({ error: 'No token received' }, window.location.origin);
        }
        window.close();
      }, 2000);
      return;
    }

    // Prepare auth data to send back to parent window
    const authData = {
      token,
      email,
      username,
      refreshToken: refreshToken || token
    };

    // console.log('GoogleCallback: Sending auth data to parent window');
    
    // Send data back to the opener (parent window)
    if (window.opener) {
      window.opener.postMessage(authData, window.location.origin);
      setSuccess(true);
      
      // Close this popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      console.error('GoogleCallback: No opener window found');
      setError('Unable to communicate with parent window');
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
