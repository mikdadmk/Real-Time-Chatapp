// login/page.js (Fixed checkUserRegistrationMethod Function and Role-Based Redirection)
'use client';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    localStorage.removeItem('user_email'); // Clear stored email on logout
    setIsGoogleUser(null); // Reset user type to show both options
  }, []);

  async function checkUserRegistrationMethod(email) {
    try {
      const res = await fetch(`/api/user-role?email=${email}`);
      const data = await res.json();
      setIsGoogleUser(data.isGoogleUser || false);
    } catch (error) {
      console.error('Failed to check user method:', error);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    localStorage.setItem('user_email', email);
    await checkUserRegistrationMethod(email);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const res = await fetch(`/api/user-role?email=${email}`);
      const data = await res.json();
      if (data.role === 'admin') {
        router.push('/admin');
      } else if (data.role === 'subadmin') {
        router.push('/subadmin');
      } else {
        router.push('/user');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('user_email', user.email);
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
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Login</h2>
        {isGoogleUser === true && (
          <p className="text-red-500 text-center mb-2">This account was registered with Google. Please login with Google.</p>
        )}
        {/* <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 mb-4">Sign in with Google</button> */}
        {!isGoogleUser && (
          <form className="mt-4" onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300" />
            <input type="password" name="password" placeholder="Password" required className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-300" />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">Login</button>
          </form>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}