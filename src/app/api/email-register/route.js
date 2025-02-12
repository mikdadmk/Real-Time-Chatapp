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