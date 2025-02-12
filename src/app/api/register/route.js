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