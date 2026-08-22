import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function main() {
  // Standard Prisma Client - uses DATABASE_URL from environment
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Production Admin Bootstrap');
    console.log('');

    // Safe connectivity check
    const dbInfo = await prisma.$queryRaw<Array<{ current_database: string; current_user: string }>>`
      SELECT current_database(), current_user
    `;
    console.log('Database:', '[PRODUCTION]');
    console.log('DB User:', dbInfo[0]?.current_user || '[UNKNOWN]');
    console.log('');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@shensafu.com' },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      console.log('   Active:', existingAdmin.isActive);
      console.log('');
      console.log('✅ Bootstrap skipped - admin exists');
      return;
    }

    // Create admin user with bcrypt
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@shensafu.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('✅ Admin created successfully:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
    console.log('   Created:', admin.createdAt);
    console.log('');
    console.log('🔐 Default Password: admin123');
    console.log('⚠️  Change this password in production!');

  } catch (error) {
    console.error('❌ Bootstrap failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
