import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import prisma from '../db';
import { cookieOptions, requireAuth, signToken } from '../auth';
import { passwordSchema } from '../validate';

const router = Router();

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Wait a few minutes and try again.' },
});

router.post('/login', loginLimit, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) {
    res.status(400).json({ error: 'Enter your email and password.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: 'Those sign-in details are not correct.' });
    return;
  }

  const token = signToken(user);
  res.cookie('token', token, cookieOptions());
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

router.post('/password', requireAuth, async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Check the passwords.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
    res.status(400).json({ error: 'The current password is not correct.' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  res.json({ ok: true });
});

export default router;
