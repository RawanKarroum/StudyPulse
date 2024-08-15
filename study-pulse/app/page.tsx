'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/signin');
  }, [router]);

  return null; // Optionally, you can return null or a loading spinner while the redirect is happening
};

export default HomePage;
