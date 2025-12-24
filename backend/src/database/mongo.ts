import mongoose from "mongoose";
import { ENV } from "../configuration/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConn || {
  conn: null,
  promise: null,
};

export const connectMongo = async () => {
  if (!ENV.MONGO_URI) {
    throw new Error(
      "❌ MongoDB URI is missing. Check MONGO_URI_DEV / MONGO_URI_PROD"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(ENV.MONGO_URI, {
      bufferCommands: false,
      autoIndex: ENV.NODE_ENV !== "production",
    });
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;

  console.log("✅ MongoDB connected");
  return cached.conn;
};
