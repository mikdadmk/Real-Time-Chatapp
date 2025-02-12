'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function Sidebar({ setActiveChat }) {
  const { user } = useAuth();
  const currentUserEmail = user?.email || localStorage.getItem('user_email');
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    // ✅ Fetch all users from database
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const data = await res.json();
        setUsers(data.filter((u) => u.email !== currentUserEmail)); // ✅ Hide own profile
      } catch (error) {
        console.error('❌ Error fetching users:', error);
      }
    };

    fetchUsers();

    if (currentUserEmail) {
      console.log(`🔹 Sending 'join' event for: ${currentUserEmail}`);
      socket.emit('join', { userEmail: currentUserEmail });
    }

    socket.on('updateUsers', (onlineUsersArray) => {
      console.log('🟢 Online Users Updated:', onlineUsersArray);
      setOnlineUsers(new Set(onlineUsersArray)); // ✅ Store online users
    });

    return () => {
      if (currentUserEmail) {
        console.log(`🔹 Sending 'leave' event for: ${currentUserEmail}`);
        socket.emit('leave', { userEmail: currentUserEmail });
      }
      socket.off('updateUsers');
    };
  }, [currentUserEmail]);

  return (
    <div className="w-1/4 min-h-screen bg-gray-900 text-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Users</h2>
      <ul className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center">No users found</p>
        ) : (
          users.map((user) => {
            const displayName = user.name || user.email.split('@')[0];
            const isOnline = onlineUsers.has(user.email);

            return (
              <li 
                key={user.email} 
                className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition duration-300 flex items-center space-x-3"
                onClick={() => setActiveChat(user.email)}
              >
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full relative">
                  {displayName.charAt(0).toUpperCase()}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                </div>
                <span className="text-lg font-medium">{displayName}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
