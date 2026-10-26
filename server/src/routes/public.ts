import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import prisma from '../db';
import { optionalAuth } from '../auth';
import { messageSchema } from '../validate';

const router = Router();

const settingKeys = [
  'phone',
  'phoneAlt',
  'email',
  'address',
  'facebook',
  'meetingWhen',
  'meetingWhere',
  'donationBank',
  'donationBranch',
  'donationAccountName',
  'donationAccountNumber',
  'donationNote',
  'tagline',
  'footerBlurb',
  'homeHeading',
  'homeIntro',
  'officeBearers',
  'pastLeaders',
  'members',
] as const;

function readPeople(raw: string | undefined) {
  try {
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((person) => person && typeof person === 'object')
      .map((person) => ({
        name: typeof person.name === 'string' ? person.name : '',
        detail: typeof person.detail === 'string' ? person.detail : '',
      }));
  } catch {
    return [];
  }
}

export async function readSettings() {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  let officeBearers: { role: string; name: string }[] = [];
  try {
    const parsed = JSON.parse(map.officeBearers || '[]');
    if (Array.isArray(parsed)) officeBearers = parsed;
  } catch {
    officeBearers = [];
  }
  return {
    phone: map.phone || '',
    phoneAlt: map.phoneAlt || '',
    email: map.email || '',
    address: map.address || '',
    facebook: map.facebook || '',
    meetingWhen: map.meetingWhen || '',
    meetingWhere: map.meetingWhere || '',
    donationBank: map.donationBank || '',
    donationBranch: map.donationBranch || '',
    donationAccountName: map.donationAccountName || '',
    donationAccountNumber: map.donationAccountNumber || '',
    donationNote: map.donationNote || '',
    tagline: map.tagline || 'We Serve',
    footerBlurb: map.footerBlurb || '',
    homeHeading: map.homeHeading || 'Service, close to home',
    homeIntro: map.homeIntro || '',
    officeBearers,
    pastLeaders: readPeople(map.pastLeaders),
    members: readPeople(map.members),
  };
}

const projectListSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  category: true,
  location: true,
  projectDate: true,
  coverImage: true,
  featured: true,
  isSample: true,
  status: true,
} as const;

const newsletterListSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  issueDate: true,
  coverImage: true,
  pdfUrl: true,
  isSample: true,
  status: true,
} as const;

router.get('/settings', async (_req, res) => {
  res.json(await readSettings());
});

router.get('/home', async (_req, res) => {
  const [slides, upcoming, past, newsletter] = await Promise.all([
    prisma.slide.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({
      where: { status: 'published', category: 'Upcoming' },
      orderBy: { projectDate: 'asc' },
      take: 3,
      select: projectListSelect,
    }),
    prisma.project.findMany({
      where: { status: 'published', category: { not: 'Upcoming' } },
      orderBy: { projectDate: 'desc' },
      take: 3,
      select: projectListSelect,
    }),
    prisma.newsletter.findFirst({
      where: { status: 'published' },
      orderBy: { issueDate: 'desc' },
      select: newsletterListSelect,
    }),
  ]);
  res.json({ slides, upcoming, past, newsletter });
});

router.get('/projects', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const projects = await prisma.project.findMany({
    where: {
      status: 'published',
      ...(category ? { category } : {}),
    },
    orderBy: { projectDate: 'desc' },
    select: projectListSelect,
  });
  res.json(projects);
});

router.get('/projects/:slug', optionalAuth, async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!project || (project.status !== 'published' && !req.user)) {
    res.status(404).json({ error: 'That project could not be found.' });
    return;
  }
  const related = await prisma.project.findMany({
    where: {
      status: 'published',
      slug: { not: project.slug },
      ...(project.category === 'Upcoming' ? { category: 'Upcoming' } : { category: { not: 'Upcoming' } }),
    },
    orderBy: { projectDate: project.category === 'Upcoming' ? 'asc' : 'desc' },
    take: 3,
    select: projectListSelect,
  });
  res.json({ project, related });
});

router.get('/newsletters', async (_req, res) => {
  const newsletters = await prisma.newsletter.findMany({
    where: { status: 'published' },
    orderBy: { issueDate: 'desc' },
    select: newsletterListSelect,
  });
  res.json(newsletters);
});

router.get('/newsletters/:slug', optionalAuth, async (req, res) => {
  const newsletter = await prisma.newsletter.findUnique({ where: { slug: req.params.slug } });
  if (!newsletter || (newsletter.status !== 'published' && !req.user)) {
    res.status(404).json({ error: 'That newsletter could not be found.' });
    return;
  }
  res.json(newsletter);
});

router.get('/pages/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) {
    res.status(404).json({ error: 'That page could not be found.' });
    return;
  }
  res.json(page);
});

router.get('/search', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (q.length < 2) {
    res.json({ projects: [], newsletters: [] });
    return;
  }
  const [projects, newsletters] = await Promise.all([
    prisma.project.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { projectDate: 'desc' },
      take: 8,
      select: { title: true, slug: true, summary: true, category: true },
    }),
    prisma.newsletter.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { issueDate: 'desc' },
      take: 8,
      select: { title: true, slug: true, summary: true },
    }),
  ]);
  res.json({ projects, newsletters });
});

const messageLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages from this connection. Please try again later.' },
});

router.post('/messages', messageLimit, async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Check the form and try again.' });
    return;
  }
  await prisma.message.create({ data: parsed.data });
  res.status(201).json({ ok: true });
});

export default router;
