// src->components->withRole.js
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withRole(Component, allowedRoles) {
  return function ProtectedPage(props) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(role))) {
        router.push('/login');
      }
    }, [user, role, loading]);

    if (loading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}