'use client';

import { useSession as useNextAuthSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useNextAuthSession();

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
