import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from './db';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is missing');
  return value;
}

export function signToken(user: AuthUser) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret(), { expiresIn: '7d' });
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

async function userFromRequest(req: Request) {
  const token = req.cookies?.token;
  if (!token || typeof token !== 'string') return null;
  try {
    const payload = jwt.verify(token, secret()) as { sub?: string };
    if (!payload.sub) return null;
    return prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    return null;
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  req.user = (await userFromRequest(req)) ?? undefined;
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await userFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'Please sign in again.' });
    return;
  }
  req.user = user;
  next();
}
