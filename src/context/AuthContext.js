import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        localStorage.setItem('user_email', currentUser.email);
        console.log("🔹 User logged in:", currentUser.email);

        // ✅ Send "join" event with userEmail
        socket.emit('join', { userEmail: currentUser.email });

        try {
          const res = await fetch(`/api/user-role?email=${currentUser.email}`);
          const data = await res.json();
          setRole(data.role || 'user');
        } catch (error) {
          console.error('❌ Failed to fetch user role:', error);
        }
      } else {
        localStorage.removeItem('user_email');
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout Function
  const logout = async () => {
    if (user?.email) {
      socket.emit('logout', { userEmail: user.email }); // ✅ Emit logout event
    }
    await signOut(auth);
  };

  return <AuthContext.Provider value={{ user, role, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
