import app from './app';
import config from './config';
import { connectDb } from './db';

async function start(): Promise<void> {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port} (${config.nodeEnv})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
