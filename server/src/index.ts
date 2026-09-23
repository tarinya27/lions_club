import 'dotenv/config';
import app from './app';
import prisma from './db';
import { seed } from '../prisma/seed';

const port = Number(process.env.PORT || 4000);

async function main() {
  await prisma.$connect();
  const users = await prisma.user.count();
  if (users === 0) {
    await seed();
    console.log('Starter content is in place.');
  }
  app.listen(port, () => {
    console.log(`API ready at http://127.0.0.1:${port}`);
  });
}

main().catch((error) => {
  console.error('The API could not start. Is PostgreSQL running?');
  console.error(error);
  process.exit(1);
});
