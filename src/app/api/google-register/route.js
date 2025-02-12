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