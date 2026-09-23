import { Router } from 'express';
import multer from 'multer';
import prisma from '../db';
import { requireAuth } from '../auth';
import { dateKey, parseDate, uniqueSlug } from '../slug';
import { upload } from '../upload';
import { newsletterSchema, pageSchema, projectSchema, settingsSchema, slideSchema } from '../validate';
import { readSettings } from './public';

const router = Router();
router.use(requireAuth);

function firstError(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message || 'Check the form and try again.';
}

router.get('/dashboard', async (_req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [projectCount, newsletterCount, unreadMessages, sampleProjects, sampleNewsletters, latestProject, latestNewsletter, recentProject, recentNewsletter, projects, newsletters] =
    await Promise.all([
      prisma.project.count({ where: { status: 'published' } }),
      prisma.newsletter.count({ where: { status: 'published' } }),
      prisma.message.count({ where: { isRead: false } }),
      prisma.project.count({ where: { isSample: true } }),
      prisma.newsletter.count({ where: { isSample: true } }),
      prisma.project.findFirst({
        where: { status: 'published', isSample: false },
        orderBy: { projectDate: 'desc' },
        select: { title: true, projectDate: true, slug: true },
      }),
      prisma.newsletter.findFirst({
        where: { status: 'published', isSample: false },
        orderBy: { issueDate: 'desc' },
        select: { title: true, issueDate: true, slug: true },
      }),
      prisma.project.findFirst({
        where: { status: 'published', isSample: false, projectDate: { gte: weekAgo } },
        select: { id: true },
      }),
      prisma.newsletter.findFirst({
        where: { status: 'published', isSample: false, issueDate: { gte: weekAgo } },
        select: { id: true },
      }),
      prisma.project.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, projectDate: true, isSample: true },
      }),
      prisma.newsletter.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, issueDate: true, isSample: true },
      }),
    ]);

  res.json({
    projectCount,
    newsletterCount,
    unreadMessages,
    sampleCount: sampleProjects + sampleNewsletters,
    projectStale: !recentProject,
    newsletterStale: !recentNewsletter,
    latestProject,
    latestNewsletter,
    projects,
    newsletters,
  });
});

router.delete('/samples', async (_req, res) => {
  await prisma.project.deleteMany({ where: { isSample: true } });
  await prisma.newsletter.deleteMany({ where: { isSample: true } });
  res.json({ ok: true });
});

router.get('/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { projectDate: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      projectDate: true,
      status: true,
      isSample: true,
      featured: true,
    },
  });
  res.json(projects);
});

router.get('/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ ...project, projectDate: dateKey(project.projectDate) });
});

router.post('/projects', async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const projectDate = parseDate(parsed.data.projectDate);
  if (!projectDate) {
    res.status(400).json({ error: 'Choose a valid date.' });
    return;
  }
  const slug = await uniqueSlug(parsed.data.title, async (value) => {
    const found = await prisma.project.findUnique({ where: { slug: value } });
    return Boolean(found);
  });
  const { images, projectDate: _date, ...rest } = parsed.data;
  const project = await prisma.project.create({
    data: {
      ...rest,
      slug,
      projectDate,
      images: { create: images.map((image, index) => ({ ...image, sortOrder: index })) },
    },
    include: { images: true },
  });
  res.status(201).json(project);
});

router.put('/projects/:id', async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  const projectDate = parseDate(parsed.data.projectDate);
  if (!projectDate) {
    res.status(400).json({ error: 'Choose a valid date.' });
    return;
  }
  const { images, projectDate: _date, ...rest } = parsed.data;
  const project = await prisma.project.update({
    where: { id: existing.id },
    data: {
      ...rest,
      projectDate,
      images: {
        deleteMany: {},
        create: images.map((image, index) => ({ ...image, sortOrder: index })),
      },
    },
    include: { images: true },
  });
  res.json(project);
});

router.delete('/projects/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

router.get('/newsletters', async (_req, res) => {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { issueDate: 'desc' },
    select: { id: true, title: true, slug: true, issueDate: true, status: true, isSample: true, pdfUrl: true },
  });
  res.json(newsletters);
});

router.get('/newsletters/:id', async (req, res) => {
  const newsletter = await prisma.newsletter.findUnique({ where: { id: req.params.id } });
  if (!newsletter) {
    res.status(404).json({ error: 'Newsletter not found.' });
    return;
  }
  res.json({ ...newsletter, issueDate: dateKey(newsletter.issueDate) });
});

router.post('/newsletters', async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const issueDate = parseDate(parsed.data.issueDate);
  if (!issueDate) {
    res.status(400).json({ error: 'Choose a valid date.' });
    return;
  }
  const slug = await uniqueSlug(parsed.data.title, async (value) => {
    const found = await prisma.newsletter.findUnique({ where: { slug: value } });
    return Boolean(found);
  });
  const { issueDate: _date, ...rest } = parsed.data;
  const newsletter = await prisma.newsletter.create({ data: { ...rest, slug, issueDate } });
  res.status(201).json(newsletter);
});

router.put('/newsletters/:id', async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const existing = await prisma.newsletter.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Newsletter not found.' });
    return;
  }
  const issueDate = parseDate(parsed.data.issueDate);
  if (!issueDate) {
    res.status(400).json({ error: 'Choose a valid date.' });
    return;
  }
  const { issueDate: _date, ...rest } = parsed.data;
  const newsletter = await prisma.newsletter.update({
    where: { id: existing.id },
    data: { ...rest, issueDate },
  });
  res.json(newsletter);
});

router.delete('/newsletters/:id', async (req, res) => {
  await prisma.newsletter.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

router.get('/slides', async (_req, res) => {
  const slides = await prisma.slide.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(slides);
});

router.post('/slides', async (req, res) => {
  const parsed = slideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const slide = await prisma.slide.create({ data: parsed.data });
  res.status(201).json(slide);
});

router.put('/slides/:id', async (req, res) => {
  const parsed = slideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const slide = await prisma.slide.update({ where: { id: req.params.id }, data: parsed.data }).catch(() => null);
  if (!slide) {
    res.status(404).json({ error: 'Slide not found.' });
    return;
  }
  res.json(slide);
});

router.delete('/slides/:id', async (req, res) => {
  await prisma.slide.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

router.get('/pages', async (_req, res) => {
  const pages = await prisma.page.findMany({ orderBy: { title: 'asc' }, select: { id: true, slug: true, title: true, updatedAt: true } });
  res.json(pages);
});

router.get('/pages/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) {
    res.status(404).json({ error: 'Page not found.' });
    return;
  }
  res.json(page);
});

router.put('/pages/:slug', async (req, res) => {
  const parsed = pageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const page = await prisma.page.update({ where: { slug: req.params.slug }, data: parsed.data }).catch(() => null);
  if (!page) {
    res.status(404).json({ error: 'Page not found.' });
    return;
  }
  res.json(page);
});

router.get('/messages', async (_req, res) => {
  const messages = await prisma.message.findMany({ orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }] });
  res.json(messages);
});

router.patch('/messages/:id', async (req, res) => {
  const isRead = Boolean(req.body?.isRead);
  const message = await prisma.message.update({ where: { id: req.params.id }, data: { isRead } }).catch(() => null);
  if (!message) {
    res.status(404).json({ error: 'Message not found.' });
    return;
  }
  res.json(message);
});

router.delete('/messages/:id', async (req, res) => {
  await prisma.message.delete({ where: { id: req.params.id } }).catch(() => null);
  res.json({ ok: true });
});

router.get('/settings', async (_req, res) => {
  res.json(await readSettings());
});

router.put('/settings', async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: firstError(parsed.error) });
    return;
  }
  const entries = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value: key === 'officeBearers' ? JSON.stringify(value) : String(value),
  }));
  await prisma.$transaction(
    entries.map((entry) =>
      prisma.setting.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: entry,
      }),
    ),
  );
  res.json(await readSettings());
});

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      const message = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
        ? 'That file is larger than 8 MB.'
        : error.message || 'The file could not be uploaded.';
      res.status(400).json({ error: message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'Choose a file to upload.' });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
