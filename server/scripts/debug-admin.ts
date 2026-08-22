import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@shensafu.com' },
  });

  if (!admin) {
    console.log('Admin not found');
    return;
  }

  console.log('Admin record:');
  console.log(JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    passwordLength: admin.password ? admin.password.length : 'NULL/UNDEFINED'
  }, null, 2));

  console.log('');
  console.log('Password field type:', typeof admin.password);
  console.log('Password field value:', admin.password ? admin.password.substring(0, 20) + '...' : 'NULL/UNDEFINED');

  await prisma.$disconnect();
}

check().catch(console.error);
