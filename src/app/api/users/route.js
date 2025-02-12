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
