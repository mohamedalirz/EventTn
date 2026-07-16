const bcrypt = require('bcrypt');
const prisma = require('../config/db');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const userPublicSelect = {
  id: true,
  fullname: true,
  email: true,
  role: true,
  createdAt: true,
};

async function register({ fullname, email, password, role }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      role, // ORGANIZER or SPONSOR only (enforced in validator)
    },
    select: userPublicSelect,
  });

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken({ id: user.id, role: user.role });

  const { password: _pw, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

module.exports = { register, login, userPublicSelect };
