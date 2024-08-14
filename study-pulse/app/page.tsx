"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the landing page
    router.push('/landing');
  }, [router]);

  return null; // Since we're redirecting, there's no need to render anything.
}
