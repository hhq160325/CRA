import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { tokenUtils, decodeJWT, getRoleFromToken, getRedirectPathByRole } from '../utils';
import { updateUserData } from '../authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // The backend returns JSON at this URL, we need to extract it
        // Since we're already at the callback URL, try to get the response from the page
        const pageText = document.body.innerText;
        
        let authData;
        try {
          // Try to parse the JSON from the page
          authData = JSON.parse(pageText);
        } catch (e) {
          // If page doesn't contain JSON, it might be in URL params
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          const email = urlParams.get('email');
          const username = urlParams.get('username');
          const expiration = urlParams.get('expiration');
          
          if (token) {
            authData = { token, email, username, expiration };
          } else {
            throw new Error('No authentication data found');
          }
        }

        const { token, email, username, expiration, refreshToken } = authData;

        if (!token) {
          throw new Error('No token received from Google OAuth');
        }

        // Decode token to get role and user ID
        const decoded = decodeJWT(token);
        const roleId = getRoleFromToken(token);
        const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

        // Prepare user object
        const user = {
          email: email || decoded?.email,
          username: username || decoded?.name,
          roleId: roleId
        };

        // Store tokens and user data
        tokenUtils.storeTokens(token, refreshToken || token, user);

        // Fetch full user data if we have userId
        if (userId) {
          try {
            const { getUserById } = await import('../../user/api');
            const userData = await getUserById();
            
            // Update localStorage with full user data
            tokenUtils.updateUserData({
              username: userData.username,
              imageAvatar: userData.imageAvatar
            });

            // Update Redux state
            dispatch(updateUserData({
              username: userData.username,
              imageAvatar: userData.imageAvatar
            }));
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
            // Continue with login even if user data fetch fails
          }
        }

        // Check if this is opened in a new tab (has opener)
        if (window.opener && !window.opener.closed) {
          // Notify parent window and close this tab
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
          window.close();
        } else {
          // If not in a new tab, redirect normally
          const redirectPath = getRedirectPathByRole(roleId);
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 500);
        }

      } catch (error) {
        console.error('Error handling Google callback:', error);
        setError(error.message);
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    };

    handleGoogleCallback();
  }, [navigate, dispatch]);

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
