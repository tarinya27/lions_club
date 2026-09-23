import { z } from 'zod';

export const categories = [
  'Vision',
  'Hunger',
  'Environment',
  'Youth',
  'Health',
  'Education',
  'Community',
  'Other',
] as const;

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date.');

export const projectSchema = z.object({
  title: z.string().trim().min(3, 'Title should be at least 3 characters.').max(160),
  summary: z.string().trim().min(10, 'Add a short summary.').max(400),
  body: z.string().trim().min(10, 'Write the project report.').max(20000),
  category: z.enum(categories),
  location: z.string().trim().max(160).optional().default(''),
  projectDate: dateField,
  coverImage: z.string().trim().max(500).optional().default(''),
  status: z.enum(['draft', 'published']),
  featured: z.boolean().optional().default(false),
  isSample: z.boolean().optional().default(false),
  images: z
    .array(
      z.object({
        url: z.string().trim().min(1).max(500),
        caption: z.string().trim().max(180).optional().default(''),
      }),
    )
    .max(12)
    .optional()
    .default([]),
});

export const newsletterSchema = z.object({
  title: z.string().trim().min(3, 'Title should be at least 3 characters.').max(160),
  summary: z.string().trim().min(10, 'Add a short summary.').max(400),
  body: z.string().trim().min(10, 'Write the newsletter.').max(20000),
  issueDate: dateField,
  coverImage: z.string().trim().max(500).optional().default(''),
  pdfUrl: z.string().trim().max(500).optional().default(''),
  status: z.enum(['draft', 'published']),
  isSample: z.boolean().optional().default(false),
});

export const slideSchema = z.object({
  eyebrow: z.string().trim().max(80).optional().default(''),
  title: z.string().trim().min(3, 'Add a headline.').max(120),
  imageUrl: z.string().trim().max(500).optional().default(''),
  primaryLabel: z.string().trim().min(1).max(40),
  primaryHref: z.string().trim().min(1).max(200),
  secondaryLabel: z.string().trim().min(1).max(40),
  secondaryHref: z.string().trim().min(1).max(200),
  sortOrder: z.number().int().min(0).max(100).optional().default(0),
  active: z.boolean().optional().default(true),
});

export const pageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  excerpt: z.string().trim().max(300).optional().default(''),
  body: z.string().trim().min(10, 'Write the page.').max(20000),
});

export const messageSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(160),
  phone: z.string().trim().max(40).optional().default(''),
  subject: z.string().trim().min(3, 'Add a subject.').max(160),
  body: z.string().trim().min(10, 'Write a short message.').max(4000),
});

const bearerSchema = z.object({
  role: z.string().trim().max(80),
  name: z.string().trim().max(120),
});

const personSchema = z.object({
  name: z.string().trim().max(120),
  detail: z.string().trim().max(160),
});

export const settingsSchema = z.object({
  phone: z.string().trim().max(40),
  phoneAlt: z.string().trim().max(40),
  email: z.string().trim().email('Enter the club email.').max(160),
  address: z.string().trim().min(3).max(200),
  facebook: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === '' || value.startsWith('https://'), 'Facebook link should start with https://'),
  meetingWhen: z.string().trim().max(160),
  meetingWhere: z.string().trim().max(200),
  donationBank: z.string().trim().max(120),
  donationBranch: z.string().trim().max(120),
  donationAccountName: z.string().trim().max(160),
  donationAccountNumber: z.string().trim().max(80),
  donationNote: z.string().trim().max(600),
  tagline: z.string().trim().max(80),
  footerBlurb: z.string().trim().max(400),
  homeHeading: z.string().trim().min(2).max(120),
  homeIntro: z.string().trim().min(10).max(600),
  officeBearers: z.array(bearerSchema).max(12),
  pastLeaders: z.array(personSchema).max(60),
  members: z.array(personSchema).max(120),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: z.string().min(8, 'Use at least 8 characters.'),
});
