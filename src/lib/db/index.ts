import mongoose from 'mongoose';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

// Default to localhost if no MONGODB_URI is provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reciperoyalty';

const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("Connected to MongoDB at:", MONGODB_URI);
        return mongoose;
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error establishing MongoDB connection:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
