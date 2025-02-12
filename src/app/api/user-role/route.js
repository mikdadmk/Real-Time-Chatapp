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