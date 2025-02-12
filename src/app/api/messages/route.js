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
