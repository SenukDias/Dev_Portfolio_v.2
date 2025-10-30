import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/authProvider';

const CallbackPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const { username } = router.query;

    if (username) {
      login(username as string);
      router.push('/');
    }
  }, [router.query]);

  return <div>Authenticating...</div>;
};

export default CallbackPage;
