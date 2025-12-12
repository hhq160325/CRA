import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../authSlice';
import { getRoleFromToken, getRedirectPathByRole } from '../utils';

/**
 * Custom hook to handle OAuth authentication via postMessage
 * Listens for authentication data from popup windows and processes the login flow
 */
export const useOAuthMessageHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event) => {
      const data = event.data;
      
      // Ignore webpack and other dev messages
      if (!data || typeof data !== 'object' || 
          data.type === 'webpackWarnings' || 
          data.type === 'webpackOk' || 
          data.source === 'react-devtools-bridge' || 
          data.source === 'react-devtools-content-script') {
        return;
      }

      console.log('Login: Received postMessage:', {
        origin: event.origin,
        data: data,
        hasToken: !!(data.token || data.JwtToken),
        dataKeys: Object.keys(data)
      });

      // Check if this is Google auth data
      const token = data.token || data.JwtToken;
      const isGoogleAuth = data.IsGoogle === "True" || data.IsGoogle === true;
      
      if (isGoogleAuth) {
        try {
          const email = data.email || data.Email;
          const username = data.username || data.Username;
          
          // If no token, this is a registration response - need to call google-callback to get token
          if (!token) {
            console.log('Login: No token received, calling google-callback to get JWT...');
            
            try {
              // Import API config
              const { AUTH_ENDPOINTS } = await import('../../../config/api');
              
              // Call the google-callback endpoint to get the JWT token
              const response = await fetch(AUTH_ENDPOINTS.GOOGLE_CALLBACK, {
                method: 'GET',
                credentials: 'include'
              });
              
              if (!response.ok) {
                throw new Error('Failed to get JWT token from google-callback');
              }
              
              // Extract JWT from HTML response
              const html = await response.text();
              console.log('google-callback response body:', html);
              
              // Extract JSON data from the postMessage script
              const jsonMatch = html.match(/window\.opener\.postMessage\((.*?),\s*'\*'\)/s);
              if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[1]);
                console.log('Extracted token data:', jsonData);
                
                // Trigger the message handler with the extracted data
                window.postMessage(jsonData, window.location.origin);
                return;
              } else {
                console.error('Could not extract token from HTML response');
                return;
              }
            } catch (callbackError) {
              console.error('Error calling google-callback:', callbackError);
              return;
            }
          }
          
          // If we have a token, process it
          const refreshToken = data.refreshToken || data.RefreshToken;

          // Decode token to get role and user ID
          const { decodeJWT, tokenUtils } = await import('../utils');
          const decoded = decodeJWT(token);
          const roleId = getRoleFromToken(token);
          const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

          const user = {
            email: email || decoded?.email,
            username: username || decoded?.name,
            roleId: roleId
          };

          // Store tokens and user data
          tokenUtils.storeTokens(token, refreshToken || token, user);

          // Update Redux state immediately with basic user data
          dispatch(loginUser.fulfilled({
            user: user,
            accessToken: token
          }));

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

              // Update Redux state with full user data
              const { updateUserData } = await import('../authSlice');
              dispatch(updateUserData({
                username: userData.username,
                imageAvatar: userData.imageAvatar
              }));
            } catch (userError) {
              console.error('Failed to fetch user data:', userError);
            }
          }

          // Redirect to appropriate page based on role
          const redirectPath = getRedirectPathByRole(roleId);
          navigate(redirectPath);
        } catch (error) {
          console.error('Error processing Google auth:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, dispatch]);
};