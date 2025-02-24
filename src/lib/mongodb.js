import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
// const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let db;

if (process.env.NODE_ENV === 'development') {
  // Prevent multiple MongoDB connections in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  client = await global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
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