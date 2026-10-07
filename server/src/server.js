import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { createAdminIfNotExists } from './services/authService.js';
import { User } from './models/User.js';
import { runSeed } from './seed/seed.js';

const start = async () => {
  await connectDB();

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Empty database — seeding demo data...');
    await runSeed({ disconnect: false });
  } else {
    await createAdminIfNotExists({
      email: env.adminEmail,
      password: env.adminPassword,
      fullName: env.adminName,
    });
  }

  app.listen(env.port, '127.0.0.1', () => {
    console.log(`CareerBridge server running on port ${env.port}`);
    console.log(`API health check: http://127.0.0.1:${env.port}/api/health`);
  });
};

start();
