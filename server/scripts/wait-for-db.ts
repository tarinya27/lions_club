import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is missing from server/.env');
  process.exit(1);
}

for (let attempt = 1; attempt <= 90; attempt += 1) {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.end();
    console.log('Database is accepting connections.');
    process.exit(0);
  } catch {
    await client.end().catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

console.error('The database did not start in time. Check the db log above.');
process.exit(1);
