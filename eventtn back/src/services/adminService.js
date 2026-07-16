const prisma = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, fullname: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getAllEvents() {
  return prisma.event.findMany({
    include: { organizer: { select: { id: true, fullname: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function getAllSponsorships() {
  return prisma.sponsorshipRequest.findMany({
    include: {
      sponsor: { select: { id: true, fullname: true, email: true } },
      event: { select: { id: true, title: true, organizerId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function deleteUser(id) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await prisma.user.delete({ where: { id } });
}

async function deleteEvent(id) {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  await prisma.event.delete({ where: { id } });
}

module.exports = {
  getAllUsers,
  getAllEvents,
  getAllSponsorships,
  deleteUser,
  deleteEvent,
};
