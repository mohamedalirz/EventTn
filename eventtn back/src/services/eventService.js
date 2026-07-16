const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const organizerSelect = {
  select: {
    id: true,
    fullname: true,
    email: true,
  },
};

async function getAllEvents(filters = {}) {
  const { category, city, featured, search } = filters;

  const where = {};

  if (category) where.category = category;
  if (city) where.city = city;
  if (featured !== undefined) where.featured = featured === 'true';
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.event.findMany({
    where,
    include: { organizer: organizerSelect },
    orderBy: { createdAt: 'desc' },
  });
}

async function getEventById(id) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: organizerSelect },
  });

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  return event;
}

async function createEvent(data, organizerId) {
  return prisma.event.create({
    data: {
      ...data,
      organizerId,
    },
    include: { organizer: organizerSelect },
  });
}

async function updateEvent(id, data, user) {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  if (event.organizerId !== user.id && user.role !== 'ADMIN') {
    throw new AppError('You are not authorized to update this event.', 403);
  }

  return prisma.event.update({
    where: { id },
    data,
    include: { organizer: organizerSelect },
  });
}

async function deleteEvent(id, user) {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  if (event.organizerId !== user.id && user.role !== 'ADMIN') {
    throw new AppError('You are not authorized to delete this event.', 403);
  }

  await prisma.event.delete({ where: { id } });
}

async function getEventsByOrganizer(organizerId) {
  return prisma.event.findMany({
    where: { organizerId },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
};
