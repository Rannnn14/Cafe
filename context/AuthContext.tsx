import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Restoring token failed', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreToken();
  }, []);

  const signIn = async () => {
    setIsLoading(true);
    try {
      // Mock authentication
      const dummyToken = 'dummy-auth-token';
      await SecureStore.setItemAsync('userToken', dummyToken);
      setUserToken(dummyToken);
    } catch (e) {
      console.error('Sign in failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    setIsLoading(true);
    try {
      // Mock registration
      const dummyToken = 'dummy-auth-token';
      await SecureStore.setItemAsync('userToken', dummyToken);
      setUserToken(dummyToken);
    } catch (e) {
      console.error('Sign up failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUserToken(null);
    } catch (e) {
      console.error('Sign out failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Protected route logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!userToken && !inAuthGroup) {
      // If not logged in and trying to access something other than auth screens
      router.replace('/(auth)/login' as any);
    } else if (userToken && inAuthGroup) {
      // If logged in and trying to access auth screens
      router.replace('/(tabs)' as any);
    }
  }, [userToken, segments, isLoading]);


  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
