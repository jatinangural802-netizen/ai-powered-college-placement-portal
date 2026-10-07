import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

async function connectLocal() {
  return mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 3000 });
}

async function connectMemory() {
  process.env.MONGOMS_SKIP_MD5_CHECK = 'true';
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri('careerbridge');
  console.log('Using in-memory MongoDB (local MongoDB not available)');
  return mongoose.connect(uri);
}

export const connectDB = async () => {
  try {
    const conn = await connectLocal();
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    if (env.useMemoryDb || process.env.NODE_ENV !== 'production') {
      try {
        const conn = await connectMemory();
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
      } catch (memErr) {
        console.error('\n❌ Could not connect to MongoDB:', localErr.message);
        console.error('In-memory fallback also failed:', memErr.message);
      }
    }
    console.error('\n❌ MongoDB is required. Options:');
    console.error('  1. Install MongoDB Community (https://www.mongodb.com/try/download/community)');
    console.error('  2. Use MongoDB Atlas — set MONGO_URI in server/.env');
    console.error('  3. Set USE_MEMORY_DB=true in server/.env (auto-fallback enabled)\n');
    process.exit(1);
  }
};

export const stopMemoryServer = async () => {
  if (memoryServer) await memoryServer.stop();
};
