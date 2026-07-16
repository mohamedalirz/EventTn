/**
 * EventTN uses Prisma ORM as its data access layer.
 * The actual model definitions (User, Event, SponsorshipRequest) live in
 * `src/prisma/schema.prisma`, which is the single source of truth for the
 * database schema.
 *
 * This file simply re-exports the shared Prisma client instance so that
 * other parts of the app (or anyone looking for a traditional "models"
 * folder) have a clear entry point.
 */
const prisma = require('../config/db');

module.exports = prisma;
