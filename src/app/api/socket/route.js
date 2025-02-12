import { initializeSocket } from '@/lib/socket';

export async function GET(req) {
  if (!global.io) {
    console.log('🔄 Initializing WebSocket in Next.js API...');
    global.io = initializeSocket();
  } else {
    console.log('🟢 WebSocket Server Already Running.');
  }

  return new Response('WebSocket Server is running', { status: 200 });
}