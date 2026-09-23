import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const databaseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/db');
const port = Number(process.env.PG_PORT || 5433);
const user = process.env.PG_USER || 'postgres';
const password = process.env.PG_PASSWORD || 'lions_dev_password';
const database = process.env.PG_DATABASE || 'lionsclub';

if (process.env.EMBEDDED_POSTGRES === 'false') {
  console.log('Embedded Postgres is off. The API will use DATABASE_URL.');
  process.exit(0);
}

const embedded = new EmbeddedPostgres({
  databaseDir,
  user,
  password,
  port,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  postgresFlags: ['-c', 'listen_addresses=127.0.0.1'],
  onLog: (message) => {
    const text = typeof message === 'string' ? message : String(message);
    if (/error|fatal|ready to accept/i.test(text)) console.log(text.trim());
  },
  onError: (message) => {
    const text = typeof message === 'string' ? message : String(message);
    if (text.trim()) console.error(text);
  },
});

async function main() {
  if (!fs.existsSync(path.join(databaseDir, 'PG_VERSION'))) {
    fs.mkdirSync(databaseDir, { recursive: true });
    console.log('Preparing the club database for the first time…');
    await embedded.initialise();
  }

  await embedded.start();

  const client = new pg.Client({ host: '127.0.0.1', port, user, password, database: 'postgres' });
  await client.connect();
  const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
  if (exists.rowCount === 0) {
    await client.query(`CREATE DATABASE "${database}"`);
  }
  await client.end();

  console.log(`PostgreSQL ready at 127.0.0.1:${port}/${database}`);
  await new Promise(() => {});
}

main().catch((error) => {
  console.error('Could not start PostgreSQL.');
  console.error(error);
  process.exit(1);
});
