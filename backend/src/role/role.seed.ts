// rele.seed.ts
import { Role } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface RoleSeed {
  id: number;
  name: string;
  title: string;
  description: string;
}

export async function seedRoles() {
  const prisma = new PrismaService();

  // Define default roles
  const rolesSeed: RoleSeed[] = [
    {
      id: 1,
      name: 'USER',
      title: 'کاربر',
      description: 'کاربر معمولی با دسترسی محدود',
    },
    { id: 2, name: 'ADMIN', title: 'مدیر', description: 'مدیر با دسترسی کامل' },
  ];

  console.log(`Seeding ${rolesSeed.length} roles...`);

  const roles: Role[] = [];
  for (const r of rolesSeed) {
    try {
      const role = await prisma.role.upsert({
        where: { id: r.id },
        create: {
          id: r.id,
          name: r.name,
          title: r.title,
          description: r.description,
        },
        update: { title: r.title, description: r.description },
      });
      roles.push(role);
      console.log(`✅ Seeded role: ${r.name} (${r.title})`);
    } catch (err) {
      console.error(`❌ Failed to seed role: ${r.name}`, err);
    }
  }

  console.log('Roles seeding complete.');
  return roles;
}
