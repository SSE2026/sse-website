import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('=== USER COUNT ===');
    console.log(`Total users: ${users.length}`);
    
    console.log('\n=== ALL USERS ===');
    users.forEach((user, i) => {
      console.log(`${i + 1}. Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Active: ${user.isActive}`);
    });

    // Check admin users specifically
    const admins = users.filter(u => u.role === 'ADMIN');
    console.log('\n=== ADMIN USERS ===');
    console.log(`Admin count: ${admins.length}`);
    admins.forEach((admin) => {
      console.log(`- Email: ${admin.email}, Name: ${admin.name}, Active: ${admin.isActive}`);
    });

    // Check if the seed admin exists
    const seedAdmin = users.find(u => u.email === 'admin@shensafu.com');
    console.log('\n=== SEED ADMIN CHECK ===');
    if (seedAdmin) {
      console.log(`✅ Seed admin exists: ${seedAdmin.email}`);
      console.log(`   Role: ${seedAdmin.role}`);
      console.log(`   Active: ${seedAdmin.isActive}`);
    } else {
      console.log('❌ Seed admin NOT found (admin@shensafu.com)');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
