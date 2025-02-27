import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface User {
  email: string;
  name: string;
  photoUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '673203126149-537pq9iembg9eo3chu0ovd2snka95u55.apps.googleusercontent.com',
    scopes: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly']
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      handleSignInResponse(response.authentication?.accessToken);
    }
  }, [response]);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');
      
      if (token && userData) {
        setState({
          isAuthenticated: true,
          accessToken: token,
          user: JSON.parse(userData),
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSignInResponse = async (token: string | undefined) => {
    if (!token) return;

    try {
      const userResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = await userResponse.json();
      const user = {
        email: userData.email,
        name: userData.name,
        photoUrl: userData.picture,
      };

      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));

      setState({
        isAuthenticated: true,
        user,
        accessToken: token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await promptAsync();
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      setState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};