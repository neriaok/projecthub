import { Types } from 'mongoose';
import config from '../config';
import { connectDb, disconnectDb } from '../db';
import User from '../models/User';
import ProjectRequest from '../models/ProjectRequest';
import { hashPassword } from '../utils/password';
import { seedUsers, seedRequests, SeedUserKey } from './seedData';

function daysFromToday(days: number): Date {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function seed(): Promise<void> {
  if (!config.seedPassword) throw new Error('Missing required environment variable: SEED_PASSWORD');

  await connectDb();
  await Promise.all([User.deleteMany({}), ProjectRequest.deleteMany({})]);

  const passwordHash = await hashPassword(config.seedPassword);
  const userIds = new Map<SeedUserKey, Types.ObjectId>();
  const managerOf = new Map<SeedUserKey, Types.ObjectId | null>();

  // Users are listed manager-first, so each manager exists before their reports.
  for (const seedUser of seedUsers) {
    const managerId = seedUser.manager ? userIds.get(seedUser.manager) ?? null : null;
    const user = await User.create({
      name: seedUser.name,
      email: seedUser.email,
      passwordHash,
      role: seedUser.role,
      department: seedUser.department,
      managerId,
    });
    userIds.set(seedUser.key, user._id);
    managerOf.set(seedUser.key, managerId);
  }

  for (const item of seedRequests) {
    const requester = seedUsers.find((u) => u.key === item.requester);
    if (!requester) throw new Error(`Unknown requester: ${item.requester}`);

    const createdAt = daysFromToday(item.createdInDays);
    const decidedAt = item.decidedInDays !== undefined ? daysFromToday(item.decidedInDays) : null;

    const request = new ProjectRequest({
      title: item.title,
      description: item.description,
      department: requester.department,
      requesterId: userIds.get(item.requester),
      approverId: managerOf.get(item.requester),
      budget: item.budget,
      startDate: daysFromToday(item.startInDays),
      endDate: daysFromToday(item.endInDays),
      priority: item.priority,
      status: item.status,
      decisionNote: item.decisionNote ?? '',
      decidedAt,
      createdAt,
      updatedAt: decidedAt ?? createdAt,
    });
    // Keep the historical createdAt/updatedAt values instead of "now".
    await request.save({ timestamps: false });
  }

  console.log(`Seeded ${seedUsers.length} users and ${seedRequests.length} project requests.`);
  console.table(seedUsers.map(({ name, email, role, department }) => ({ name, email, role, department })));
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
