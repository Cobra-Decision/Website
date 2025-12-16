import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from 'src/prisma/generated/client';

export interface UserSeed {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface UserWithRoleSeed {
  role: Role;
  user: UserSeed;
}

export async function seedUsers(usersWithRoles: UserWithRoleSeed[]) {
  const prisma = new PrismaService();

  try {
    for (const item of usersWithRoles) {
      const { role: roleSeed, user: userSeed } = item;
      // Hash user password
      const hashedPassword = await argon2.hash(userSeed.password);

      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: userSeed.email },
        create: {
          email: userSeed.email,
          password: hashedPassword,
          firstName: userSeed.firstName ?? 'Admin',
          lastName: userSeed.lastName ?? 'User',
          roleId: roleSeed.id ?? 1,
        },
        update: {
          password: hashedPassword,
          roleId: roleSeed.id ?? 1,
        },
      });

      console.log(
        `✅ User created/updated: ${user.email} with role ${roleSeed.name}`,
      );
    }

    console.log('All users seeding complete.');
  } catch (err) {
    console.error('❌ Failed to seed users:', err);
  } finally {
    await prisma.$disconnect();
  }
}
