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