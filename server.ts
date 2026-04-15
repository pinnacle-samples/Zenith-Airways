import 'dotenv/config';
import express from 'express';
import flyEasyRouter from './router';
import { Server } from 'http';

const app = express();
const PORT = process.env.PORT || 3000;
const terminationGracePeriodMs = 30000;
let isShuttingDown = false;

app.use(express.json());
app.use('/webhook', flyEasyRouter);

async function startServer(): Promise<Server> {
  try {
    return app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Zenith Airways] Failed to initialize:', err);
    process.exit(1);
  }
}

const server = await startServer();

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`Received ${signal}. Beginning graceful shutdown.`);

  const forceExitTimer = setTimeout(() => {
    console.error(
      `Graceful shutdown timed out after ${terminationGracePeriodMs / 1000} seconds. Forcing exit.`,
    );
    process.exit(1);
  }, terminationGracePeriodMs).unref();

  server.close((error) => {
    clearTimeout(forceExitTimer);

    if (error) {
      console.error('Error while closing HTTP server:', error);
      process.exit(1);
    }

    console.info('HTTP server closed cleanly.');
    console.info('Exiting.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
