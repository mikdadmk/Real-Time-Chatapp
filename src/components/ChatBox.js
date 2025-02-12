import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

export default function ChatBox({ activeChat }) {
  const { user } = useAuth();
  const currentUserEmail = user?.email;
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const formatDisplayName = (email) => email.split('@')[0];

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
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [activeChat, currentUserEmail]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (newMessage.sender === activeChat || newMessage.receiver === activeChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on('receiveMessage', handleNewMessage);
    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [activeChat]);

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
      <motion.div className="flex items-center p-3 bg-blue-500 shadow-lg rounded-t-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg">
          {activeChat ? formatDisplayName(activeChat).charAt(0).toUpperCase() : '?'}
        </div>
        <h2 className="text-xl font-semibold ml-3">{activeChat ? formatDisplayName(activeChat) : 'Select a user'}</h2>
      </motion.div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-white p-4 shadow-lg rounded-lg">
        {messages.map((msg, index) => (
          <motion.div 
            key={index} 
            className={`flex items-end my-2 ${msg.sender === currentUserEmail ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, x: msg.sender === currentUserEmail ? 50 : -50 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === currentUserEmail ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              <p>{msg.content}</p>
              <small className="block text-xs text-gray-200 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 p-2 border rounded-lg" placeholder="Type a message..." />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Send</button>
      </div>
    </div>
  );
}
