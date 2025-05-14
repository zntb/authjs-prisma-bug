import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  // Clear existing data
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      emailVerified: new Date(),
      password,
      image: 'https://example.com/john.jpg',
      accounts: {
        create: {
          type: 'oauth',
          provider: 'google',
          providerAccountId: 'google123',
          refresh_token: 'refresh_token_123',
          access_token: 'access_token_123',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'Bearer',
          scope: 'email profile',
        },
      },
      sessions: {
        create: {
          sessionToken: 'session_token_123',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      emailVerified: new Date(),
      password,
      image: 'https://example.com/jane.jpg',
      accounts: {
        create: [
          {
            type: 'oauth',
            provider: 'github',
            providerAccountId: 'github456',
            access_token: 'access_token_456',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'Bearer',
            scope: 'user repo',
          },
          {
            type: 'oauth',
            provider: 'twitter',
            providerAccountId: 'twitter789',
            access_token: 'access_token_789',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'Bearer',
          },
        ],
      },
    },
  });

  // Create verification tokens
  await prisma.verificationToken.create({
    data: {
      identifier: 'john@example.com',
      token: 'verify_123',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: 'jane@example.com',
      token: 'verify_456',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created users:', { user1, user2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
