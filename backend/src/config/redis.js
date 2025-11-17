import { createClient } from 'redis';

export const connectRedis = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.error('Redis error:', err));
  client.on('connect', () => console.log('Redis connected'));

  await client.connect();
  return client;
};
