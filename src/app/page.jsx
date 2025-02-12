'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const auth = useAuth();
  const router = useRouter();

  if (!auth) return <p>Loading...</p>; // Prevents the error

  const { user, role } = auth;

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  return (
    <div className="flex h-screen">
      <h1>Welcome {user?.email}</h1>
      <p>Your role: {role}</p>
    </div>
  );
}
