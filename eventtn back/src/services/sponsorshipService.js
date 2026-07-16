const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const includeRelations = {
  sponsor: { select: { id: true, fullname: true, email: true } },
  event: {
    select: {
      id: true,
      title: true,
      eventDate: true,
      city: true,
      organizerId: true,
    },
  },
};

async function createSponsorshipRequest({ sponsorId, eventId, message }) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new AppError('Event not found.', 404);
  }

  const existingRequest = await prisma.sponsorshipRequest.findFirst({
    where: { sponsorId, eventId, status: 'PENDING' },
  });

  if (existingRequest) {
    throw new AppError('You already have a pending sponsorship request for this event.', 409);
  }

  return prisma.sponsorshipRequest.create({
    data: { sponsorId, eventId, message },
    include: includeRelations,
  });
}

async function getMySponsorshipRequests(sponsorId) {
  return prisma.sponsorshipRequest.findMany({
    where: { sponsorId },
    include: includeRelations,
    orderBy: { createdAt: 'desc' },
  });
}

async function getOrganizerSponsorshipRequests(organizerId) {
  return prisma.sponsorshipRequest.findMany({
    where: { event: { organizerId } },
    include: includeRelations,
    orderBy: { createdAt: 'desc' },
  });
}

async function updateSponsorshipStatus(id, status, user) {
  const request = await prisma.sponsorshipRequest.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!request) {
    throw new AppError('Sponsorship request not found.', 404);
  }

  if (request.event.organizerId !== user.id && user.role !== 'ADMIN') {
    throw new AppError('You are not authorized to update this sponsorship request.', 403);
  }

  return prisma.sponsorshipRequest.update({
    where: { id },
    data: { status },
    include: includeRelations,
  });
}

module.exports = {
  createSponsorshipRequest,
  getMySponsorshipRequests,
  getOrganizerSponsorshipRequests,
  updateSponsorshipStatus,
};
