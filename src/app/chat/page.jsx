'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import ChatBox from '@/components/ChatBox';
import Sidebar from '@/components/Sidebar';

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Ensure you have a loading state in `useAuth`
  const [activeChat, setActiveChat] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [user, loading, router]);

  if (isCheckingAuth) {
    return <p className="text-center text-gray-600 mt-10">Checking authentication...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar setActiveChat={setActiveChat} />
      <ChatBox activeChat={activeChat} />
    </div>
  );
}