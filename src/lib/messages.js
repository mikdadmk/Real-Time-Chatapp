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