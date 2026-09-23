export type OfficeBearer = { role: string; name: string };

export type Settings = {
  phone: string;
  phoneAlt: string;
  email: string;
  address: string;
  facebook: string;
  meetingWhen: string;
  meetingWhere: string;
  donationBank: string;
  donationBranch: string;
  donationAccountName: string;
  donationAccountNumber: string;
  donationNote: string;
  tagline: string;
  footerBlurb: string;
  homeHeading: string;
  homeIntro: string;
  officeBearers: OfficeBearer[];
};

export const defaultSettings: Settings = {
  phone: '777369992',
  phoneAlt: '0772444131',
  email: 'lionsnugegoda@gmail.com',
  address: '02, School Lane, Nawala',
  facebook: '',
  meetingWhen: '',
  meetingWhere: '02, School Lane, Nawala',
  donationBank: '',
  donationBranch: '',
  donationAccountName: '',
  donationAccountNumber: '',
  donationNote: 'Gifts support the club’s service projects. The treasurer publishes the account details here.',
  tagline: 'We Serve',
  footerBlurb:
    'Lions Club of Nugegoda is a community service club in Nawala. Members serve neighbours through projects they publish here each week.',
  homeHeading: 'Service, close to home',
  homeIntro:
    'Lions Club of Nugegoda brings members together to serve Nugegoda, Nawala, and the communities around them. Projects and the club newsletter are published on this site every week.',
  officeBearers: [],
};

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  location: string;
  projectDate: string;
  coverImage: string;
  featured: boolean;
  isSample: boolean;
  status?: string;
};

export type ProjectImage = { id?: string; url: string; caption: string; sortOrder?: number };

export type Project = ProjectSummary & {
  body: string;
  status: string;
  images: ProjectImage[];
};

export type NewsletterSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  issueDate: string;
  coverImage: string;
  pdfUrl: string;
  isSample: boolean;
  status?: string;
};

export type Newsletter = NewsletterSummary & { body: string; status: string };

export type Slide = {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  sortOrder: number;
  active: boolean;
};

export type PageContent = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type AuthUser = { id: string; email: string; name: string; role: string };

export const categories = ['Vision', 'Hunger', 'Environment', 'Youth', 'Health', 'Education', 'Community', 'Other'] as const;
