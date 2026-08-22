import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  // Check all users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true }
  });

  console.log('Total users in database:', users.length);
  console.log('');

  if (users.length === 0) {
    console.log('No users found in database.');
  } else {
    users.forEach((u, i) => {
      console.log(`User ${i + 1}:`);
      console.log('  Email:', u.email);
      console.log('  Name:', u.name);
      console.log('  Role:', u.role);
      console.log('  Active:', u.isActive);
      console.log('');
    });
  }

  // Check if admin@shensafu.com exists
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@shensafu.com' }
  });

  console.log('admin@shensafu.com exists:', admin ? 'YES' : 'NO');

  await prisma.$disconnect();
}

check().catch(console.error);
