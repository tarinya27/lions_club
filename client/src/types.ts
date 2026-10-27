export type OfficeBearer = { role: string; name: string };
export type ClubPerson = { name: string; detail: string; photo?: string };

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
  pastLeaders: ClubPerson[];
  members: ClubPerson[];
};

export const defaultSettings: Settings = {
  phone: '777369992',
  phoneAlt: '0772444131',
  email: 'lionsnugegoda@gmail.com',
  address: '02, School Lane, Nawala',
  facebook: 'https://www.facebook.com/Lionsclubnugegoda',
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
  pastLeaders: [],
  members: [
    { name: 'Lasantha Perera', detail: 'Club President', photo: '/officers/lasantha-perera.jpg' },
    { name: 'Omar Mohammed', detail: 'Club First Vice President', photo: '/officers/omar-mohammed.jpg' },
    { name: 'Nipuna Gunarathne', detail: 'Club Second Vice President' },
    { name: 'Parakrama Gunasekara', detail: 'Club Secretary', photo: '/officers/parakrama-gunasekara.jpg' },
    { name: 'Charith Fernando', detail: 'Club Treasurer', photo: '/officers/charith-fernando.jpg' },
    { name: 'Indramalie Gunaratne', detail: 'Club Marketing Chairperson', photo: '/officers/indramalie-gunaratne.jpg' },
    { name: 'Geethika Wickramasinghe', detail: 'Club Service Chairperson', photo: '/officers/geethika-wickramasinghe.jpg' },
    { name: 'Sajitha De Mel', detail: 'Club Membership Chairperson', photo: '/officers/sajitha-de-mel.jpg' },
    { name: 'Upali De Silva', detail: 'Club LCIF Coordinator', photo: '/officers/upali-de-silva.jpg' },
    { name: 'Sunil Abeysuriya', detail: '' },
    { name: 'Rohan Goonetilleke', detail: '' },
    { name: 'Duksie Goonetilleke', detail: '' },
    { name: 'Aruna Botejue', detail: '' },
    { name: 'Ganga Dissanayake', detail: '' },
    { name: 'Mathota Arachchige Deshapriya', detail: '' },
    { name: 'Rajantha Jayasinghe', detail: '' },
    { name: 'Lorna Thomas', detail: '' },
    { name: 'Zulaikha Didi', detail: '' },
    { name: 'W G D C Jayanandana', detail: '' },
    { name: 'R P D D Dakshina Rajapaksha', detail: '' },
    { name: 'Chryshan Rodrigo', detail: '' },
    { name: 'Hiranthie Rodrigo', detail: '' },
    { name: 'Tarinya Perera', detail: '' },
  ],
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

export const projectSections = [
  { value: 'Past', label: 'Past projects' },
  { value: 'Upcoming', label: 'Upcoming projects' },
] as const;

export function projectSection(category: string): 'Past' | 'Upcoming' {
  return category === 'Upcoming' ? 'Upcoming' : 'Past';
}
