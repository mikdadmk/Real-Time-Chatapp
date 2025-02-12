'use client';
import { logout } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-gray-500 text-white p-2 mt-2">Logout</button>
  );
}