import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/authProvider';
import { useTheme } from '../../utils/themeProvider';

export const Ps1 = () => {
  const [hostname, setHostname] = useState('');
  const { theme } = useTheme();
  const { username } = useAuth();

  useEffect(() => {
    if (typeof window !== undefined) {
      setHostname(window.location.hostname);
    }
  }, []);

  return (
    <div>
      <span
        style={{
          color: theme.yellow,
        }}
      >
        {username}
      </span>
      <span
        style={{
          color: theme.white,
        }}
      >
        @
      </span>
      <span
        style={{
          color: theme.green,
        }}
      >
        {hostname}
      </span>
      <span
        style={{
          color: theme.white,
        }}
      >
        :$ ~
      </span>
    </div>
  );
};

export default Ps1;
