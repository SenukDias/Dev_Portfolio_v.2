import { signIn } from 'next-auth/react';

export const login = async (args: string[]): Promise<string> => {
  const result = await signIn('github');
  if (result.error) {
    return 'Error signing in.';
  }
  return 'Redirecting to login...';
};
