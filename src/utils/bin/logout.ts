import { signOut } from 'next-auth/react';

export const logout = async (args: string[]): Promise<string> => {
  await signOut();
  return 'Logging out...';
};
