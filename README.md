app->page.jsx
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

app->layout.jsx
"use client"


import { AuthProvider } from '@/context/AuthContext';
import "../styles/globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

app->admin->page.jsx
"use client"

import AdminPanel from '@/components/AdminPanel';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function AdminPage() {
  return (
    <div>
      <AdminPanel />
      <LogoutButton />
    </div>
  );
}

export default withRole(AdminPage, ['admin']);

app->api->check-users->route.js
import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function GET() {
  try {
    const userCount = await db.collection('users').countDocuments();
    return NextResponse.json({ isFirstUser: userCount === 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check users' }, { status: 500 });
  }
}

app->api->email-register->route.js
import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { email, role } = await req.json();
    const existingUser = await db.collection('users').findOne({ email });

    if (!existingUser) {
      await db.collection('users').insertOne({
        email,
        role,
        isGoogleUser: false,
        createdAt: new Date(),
      });
    }
    return NextResponse.json({ message: 'Email registration stored' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store Email registration' }, { status: 500 });
  }
}

app->api->google-register->route.js
import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    const existingUser = await db.collection('users').findOne({ email });

    if (!existingUser) {
      await db.collection('users').insertOne({
        email,
        name,
        role: 'user',
        isGoogleUser: true,  // ✅ Mark as Google-registered
        createdAt: new Date(),
      });
    }
    return NextResponse.json({ message: 'Google registration stored' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store Google registration' }, { status: 500 });
  }
}

app->api->messages->route.js
import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

// ✅ **Fetch messages between sender & receiver**
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Sender and receiver required' }, { status: 400 });
    }

    const messages = await db
      .collection('messages')
      .find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// ✅ **Save a new message**
export async function POST(req) {
  try {
    const { sender, receiver, content } = await req.json();
    if (!sender || !receiver || !content) {
      return NextResponse.json({ error: 'Sender, receiver, and content required' }, { status: 400 });
    }

    const newMessage = { sender, receiver, content, timestamp: new Date() };
    await db.collection('messages').insertOne(newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}


app->api->register->route.js
import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import db from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user in MongoDB with role
    await db.collection('users').insertOne({
      email: user.email,
      role: role, // 'admin', 'subadmin', or 'user'
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

app->api->socket->route.js
import { initializeSocket } from '@/lib/socket';

export async function GET(req) {
  if (!global.io) {
    console.log('🔄 Initializing WebSocket in Next.js API...');
    global.io = initializeSocket();
  } else {
    console.log('🟢 WebSocket Server Already Running.');
  }

  return new Response('WebSocket Server is running', { status: 200 });
}

app->api->user-role->route.js
import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ role: user.role, isGoogleUser: user.isGoogleUser || false });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user role' }, { status: 500 });
  }
}


app->api->users->route.js
import db from '@/lib/mongodb';

export async function GET() {
  try {
    const usersCollection = db.collection('users');
    
    const users = await usersCollection.find({}, { projection: { name: 1, email: 1, _id: 1 } }).toArray();
    
    return new Response(JSON.stringify(users), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

app->chat->page.jsx
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
app-> login-> page.jsx
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
        <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 mb-4">Sign in with Google</button>
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

app->register->page.jsx
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

app->subadmin->page.jsx
"use client";

import SubAdminPanel from '@/components/SubAdminPanel';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function SubAdminPage() {
  return (
    <div>
      <SubAdminPanel />
      <LogoutButton />
    </div>
  );
}

export default withRole(SubAdminPage, [ 'subadmin']);


app->user->page.jsx
"use client"


import ChatBox from '@/components/ChatBox';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function UserPage() {
  return (
    <div>
      <ChatBox />
      <LogoutButton />
    </div>
  );
}

export default withRole(UserPage, ['user']);



src->components->AdminPanel.js
export default function AdminPanel() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Manage users and settings here.</p>
      </div>
    );
  }

src->components->ChatBox.js
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function ChatBox({ activeChat }) {
  const { user } = useAuth();
  const currentUserEmail = user?.email;
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // ✅ Function to clean email and extract display name
  const formatDisplayName = (email) => {
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Removes special characters
  };

  // ✅ Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ **Fetch previous messages from MongoDB**
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserEmail || !activeChat) return;
      try {
        const res = await fetch(`/api/messages?sender=${currentUserEmail}&receiver=${activeChat}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); // ✅ Fetch every 3 seconds

    return () => clearInterval(interval);
  }, [activeChat, currentUserEmail]);

  // ✅ **Listen for new messages in real-time**
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log('📩 New Message Received:', newMessage);
      
      if (newMessage.sender === activeChat || newMessage.receiver === activeChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [activeChat]);

  // ✅ **Send message function**
  const sendMessage = async () => {
    if (!message.trim() || !activeChat || !currentUserEmail) return;

    const msgData = { sender: currentUserEmail, receiver: activeChat, content: message, timestamp: new Date() };

    socket.emit('sendMessage', msgData);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      });

      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col w-3/4 h-screen bg-gray-100 p-4">
      <div className="flex items-center p-3 bg-blue-500  shadow-lg rounded-t-lg">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg">
          {activeChat ? formatDisplayName(activeChat).charAt(0).toUpperCase() : '?'}
        </div>
        <h2 className="text-xl font-semibold ml-3">
          {activeChat ? formatDisplayName(activeChat) : 'Select a user'}
        </h2>
      </div>

      {/* ✅ Messages Container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-white p-4 shadow-lg rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end my-2 ${msg.sender === currentUserEmail ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== currentUserEmail && (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                {formatDisplayName(msg.sender).charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === currentUserEmail ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              <p>{msg.content}</p>
              <small className="block text-xs text-gray-200 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Message Input Box */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}

src->components->LogoutButton.js
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

export default function Message({ sender, content }) {
  return (
    <div className="mb-2 p-2 bg-gray-200 rounded-md">
      <strong>{sender}:</strong> {content}
    </div>
  );
}

src->components->Sidebar.js
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
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const data = await res.json();
        console.log('✅ API Users:', data);
        setUsers(data.filter((u) => u.email !== currentUserEmail)); // ✅ Hide own profile
      } catch (error) {
        console.error('❌ Error fetching users:', error);
      }
    };

    fetchUsers();

    if (currentUserEmail) {
      console.log(`🔹 Emitting 'join' event for: ${currentUserEmail}`);
      socket.emit('join', { userEmail: currentUserEmail });
    } else {
      console.log("⚠️ currentUserEmail is NULL, join event not sent!");
    }

    socket.on('updateUsers', (onlineUsersArray) => {
      console.log('🟢 Online Users Received:', onlineUsersArray);
      setOnlineUsers(new Set(onlineUsersArray));
    });

    return () => {
      if (currentUserEmail) {
        console.log(`🔹 Emitting 'leave' event for: ${currentUserEmail}`);
        socket.emit('leave', { userEmail: currentUserEmail });
      }
      socket.off('updateUsers');
    };
  }, [currentUserEmail]);

  return (
    <div className="w-1/4 min-h-screen bg-gray-900 text-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Online Users</h2>
      <ul className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center">No users online</p>
        ) : (
          users.map((user, index) => {
            const displayName = user.name || user.email.split('@')[0];
            const isOnline = onlineUsers.has(user.email);

            return (
              <li key={user.email} className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition duration-300 flex items-center space-x-3"
                  onClick={() => setActiveChat(user.email)}>
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


src->components->SubAdminPanel.js
export default function SubAdminPanel() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sub-Admin Dashboard</h1>
        <p>Limited access to moderation tools.</p>
      </div>
    );
  }

src->components->AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        localStorage.setItem('user_email', currentUser.email); // ✅ Store email in localStorage
        console.log("🔹 AuthContext: Logged-in user:", currentUser.email);

        try {
          const res = await fetch(`/api/user-role?email=${currentUser.email}`);
          const data = await res.json();
          setRole(data.role || 'user');
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      } else {
        localStorage.removeItem('user_email'); // ✅ Remove email on logout
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

src->lib->firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const logout = async () => {
  await signOut(auth);
};

src->lib->messages.js
import { connectToDatabase } from './mongodb';

export async function saveMessage(sender, content) {
  const { db } = await connectToDatabase();
  const newMessage = { sender, content, timestamp: new Date() };
  
  await db.collection('messages').insertOne(newMessage);
  return newMessage;
}

export async function getChatHistory() {
  const { db } = await connectToDatabase();
  return await db.collection('messages').find().sort({ timestamp: 1 }).toArray();
}

src->lib->mongodb.js
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let db;

if (process.env.NODE_ENV === 'development') {
  // Prevent multiple MongoDB connections in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  client = await global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  await client.connect();
}

db = client.db(process.env.MONGODB_DB);

export default db;

/** User Management Functions */
export async function saveUser(email, name) {
  const usersCollection = db.collection('users');
  await usersCollection.updateOne(
    { email }, // Find user by email
    { $set: { name } }, // Update name
    { upsert: true } // Insert if not exists
  );
}

export async function getAllUsers() {
  const usersCollection = db.collection('users');
  return await usersCollection.find({}, { projection: { name: 1, _id: 0 } }).toArray();
}

src->lib->socket.js
import { Server } from 'socket.io';
import db from './mongodb';

let io;
const onlineUsers = new Map(); // ✅ Store online users

export function initializeSocket(httpServer) {
  if (!io) {
    console.log('🔄 Starting WebSocket Server...');
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000', // ✅ Allow Next.js frontend
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      // **Handle user joining**
      socket.on('join', ({ userEmail }) => {
        if (!userEmail) return;
        onlineUsers.set(userEmail, socket.id);
        console.log(`🟢 User joined: ${userEmail}`);
        io.emit('updateUsers', Array.from(onlineUsers.keys()));
      });

      // **📩 Handle real-time messaging**
      socket.on('sendMessage', async ({ sender, receiver, content }) => {
        if (!sender || !receiver || !content) return;

        // ✅ Save message to MongoDB
        const newMessage = { sender, receiver, content, timestamp: new Date() };
        await db.collection('messages').insertOne(newMessage);

        // ✅ Emit message **only to the sender & receiver**
        const receiverSocketId = onlineUsers.get(receiver);
        const senderSocketId = onlineUsers.get(sender);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', newMessage);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit('receiveMessage', newMessage);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        let disconnectedUser = null;
        for (const [userEmail, id] of onlineUsers.entries()) {
          if (id === socket.id) {
            disconnectedUser = userEmail;
            onlineUsers.delete(userEmail);
            break;
          }
        }
        console.log(`❌ User disconnected: ${disconnectedUser}`);
        io.emit('updateUsers', Array.from(onlineUsers.keys()));
      });
    });

    console.log('🚀 WebSocket Server is Ready.');
  }
  return io;
}


src->components->withRole.js
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

src->styles->globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

server.js 
this is file is out of src folder that means root of folder 

const { createServer } = require('http');
const next = require('next');
const { initializeSocket } = require('./src/lib/socket');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(); // ✅ Create a separate HTTP server

  initializeSocket(httpServer); // ✅ Ensure WebSocket is initialized on HTTP server

  httpServer.on('request', (req, res) => {
    handle(req, res);
  });

  httpServer.listen(5000, () => {
    console.log('🚀 WebSocket Server running on port 5000');
  });
});


 


#   R e a l - T i m e - C h a t a p p  
 