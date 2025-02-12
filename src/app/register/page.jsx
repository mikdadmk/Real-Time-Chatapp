'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    async function checkFirstUser() {
      try {
        const res = await fetch('/api/check-users');
        const data = await res.json();
        setIsFirstUser(data.isFirstUser);
      } catch (error) {
        console.error('Failed to check first user:', error);
      }
    }
    checkFirstUser();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = isFirstUser ? 'admin' : 'user';

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await fetch('/api/email-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch('/api/google-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.displayName }),
      });

      router.push('/user');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Register</h2>
        <form className="mt-4" onSubmit={handleRegister}>
          <input type="email" name="email" placeholder="Email" required className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300" />
          <input type="password" name="password" placeholder="Password" required className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300" />
          <p className="text-gray-600 text-center">Role: <strong>{isFirstUser ? 'Admin' : 'User'}</strong></p>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">Register</button>
        </form>
        <div className="mt-4 flex items-center justify-center">
          <button onClick={handleGoogleRegister} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2">
            <span>Register with Google</span>
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}