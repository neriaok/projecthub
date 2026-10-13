import mongoose from 'mongoose';
import config from './config';

let connection: Promise<typeof mongoose> | null = null;

/** Connects once and reuses the connection, so warm serverless invocations skip the handshake. */
export function connectDb(): Promise<typeof mongoose> {
  if (!connection) {
    connection = mongoose
      .connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 })
      .then((instance) => {
        console.log(`MongoDB connected: ${instance.connection.host}/${instance.connection.name}`);
        return instance;
      })
      .catch((err) => {
        connection = null;
        throw err;
      });
  }
  return connection;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  connection = null;
}
