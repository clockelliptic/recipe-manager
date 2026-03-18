import { execSync } from 'child_process';

async function globalSetup() {
  console.log('♻️ Resetting database for E2E tests (Global Setup)...');
  try {
    execSync('npx prisma db seed');
    console.log('✅ Database seeded successfully.');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
}

export default globalSetup;
