import { useAuth } from '../authProvider';

export const login = async (args: string[]): Promise<string> => {
  if (args.length !== 1) {
    return 'Usage: login [username]';
  }

  const username = args[0];
  useAuth.getState().login(username);

  return `Logged in as ${username}`;
};

export const logout = async (): Promise<string> => {
  useAuth.getState().logout();

  return 'Logged out';
};
