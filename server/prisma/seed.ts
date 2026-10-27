import bcrypt from 'bcryptjs';
import prisma from '../src/db';

const settings: Record<string, string> = {
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
  footerBlurb: 'Lions Club of Nugegoda is a community service club in Nawala. Members serve neighbours through projects they publish here each week.',
  homeHeading: 'Service, close to home',
  homeIntro:
    'Lions Club of Nugegoda brings members together to serve Nugegoda, Nawala, and the communities around them. Projects and the club newsletter are published on this site every week.',
  pastLeaders: JSON.stringify([]),
  members: JSON.stringify([
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
  ]),
  officeBearers: JSON.stringify([
    { role: 'President', name: '' },
    { role: 'Immediate Past President', name: '' },
    { role: 'Secretary', name: '' },
    { role: 'Treasurer', name: '' },
    { role: 'First Vice President', name: '' },
    { role: 'Second Vice President', name: '' },
  ]),
};

const pages = [
  {
    slug: 'about',
    title: 'About the club',
    excerpt: 'A community service club meeting in Nawala. Our motto is We Serve.',
    body: `## Who we are

Lions Club of Nugegoda is a community service club in Nawala, Sri Lanka, and a member of Lions Clubs International. Our motto is We Serve.

The club marked its 50th year in 2015–2016. The promise is the same one members still keep: notice a need nearby, and meet it together.

## How the work is chosen

Vision, hunger, the environment, youth, and community health shape the year. In practice that becomes eye screenings, school support, clean-ups, health camps, and quiet help for families who need it.

What you read under Projects and Newsletters is written by the club and updated every week.

## Visit or write

Correspondence: lionsnugegoda@gmail.com
Club house: 02, School Lane, Nawala
Telephone: 777369992 or 0772444131`,
  },
  {
    slug: 'club-house',
    title: 'Club house',
    excerpt: '02, School Lane, Nawala',
    body: `## Where members meet

The club house is at 02, School Lane, Nawala. This is home for board meetings, project planning, and fellowship.

Call 777369992 or 0772444131, or write to lionsnugegoda@gmail.com, before you come, so someone is there to welcome you.

## Guests

Guests are welcome when the secretary has confirmed the meeting date. Arrive a few minutes early and ask for the president or the secretary.`,
  },
];

const projects = [
  {
    title: 'How a vision project is reported',
    slug: 'sample-vision-project',
    summary: 'A sample project, so the layout is visible. Replace it with this week’s real vision report.',
    category: 'Past',
    location: '',
    projectDate: new Date('2026-09-02T12:00:00.000Z'),
    featured: true,
    isSample: true,
    status: 'published',
    body: `This entry is a sample. Delete it in the admin panel and publish the club’s own report for the week.

## What to include

- Where the project was held, and the date
- The Lion who chaired it
- What members actually did
- How many people were helped, in plain numbers
- What happens next

## Photographs

Add a cover photograph from the project. A few more pictures can sit in the gallery underneath the report.

One published project a week is enough to keep the site current for members and neighbours.`,
  },
  {
    title: 'How a youth project is reported',
    slug: 'sample-youth-project',
    summary: 'A sample project for school and youth work. Replace the text with the real activity.',
    category: 'Past',
    location: '',
    projectDate: new Date('2026-08-19T12:00:00.000Z'),
    featured: false,
    isSample: true,
    status: 'published',
    body: `This is sample text for a youth or school project. Replace it before you share the site widely.

## A useful report names

- The school or place
- What was given or taught
- Who from the club was there
- How the young people responded

Keep the tone plain. Neighbours should be able to understand the project without knowing club language.`,
  },
  {
    title: 'How a community project is reported',
    slug: 'sample-community-project',
    summary: 'A sample project for local service. Swap in the week’s real community work.',
    category: 'Past',
    location: '',
    projectDate: new Date('2026-08-05T12:00:00.000Z'),
    featured: false,
    isSample: true,
    status: 'published',
    body: `Use this shape for clean-ups, food support, health camps, and other local service.

## Keep it specific

Write what happened, not a slogan. A short report that names the place and the result is more useful than a long one that does not.

When the week has no project, leave the last one published and add the next as soon as it is done.`,
  },
];

const newsletters = [
  {
    title: 'September notes — sample issue',
    slug: 'sample-september-notes',
    summary: 'A sample newsletter. Replace it with this week’s note to members and friends.',
    issueDate: new Date('2026-09-09T12:00:00.000Z'),
    isSample: true,
    status: 'published',
    pdfUrl: '',
    coverImage: '',
    body: `This is a sample issue so the newsletter page has a shape. Write the real one in the admin panel, then publish it.

## A weekly newsletter can cover

- The project just completed
- The project coming up, and who to call
- The next meeting
- A thank-you to a sponsor or a partner

## A printed issue

If the club already lays the newsletter out as a PDF, upload that file as well. Readers can open it from this page.

Publish once a week, even when the note is short.`,
  },
  {
    title: 'August notes — sample issue',
    slug: 'sample-august-notes',
    summary: 'An older sample issue, to show how the archive lists past newsletters.',
    issueDate: new Date('2026-08-12T12:00:00.000Z'),
    isSample: true,
    status: 'published',
    pdfUrl: '',
    coverImage: '',
    body: `Older issues stay in the archive after you publish a new one. Members can still open them.

Replace this sample when you are ready, or remove all sample entries from the admin dashboard.`,
  },
];

const slides = [
  {
    eyebrow: 'Lions Club of Nugegoda',
    title: 'Helping those in need',
    imageUrl: '/caldera-hall.jpg',
    primaryLabel: 'Donations',
    primaryHref: '/donations',
    secondaryLabel: 'Newsletter',
    secondaryHref: '/newsletters',
    sortOrder: 0,
    active: true,
  },
  {
    eyebrow: 'Our motto',
    title: 'We serve our community',
    imageUrl: '/hero-gathering.jpg',
    primaryLabel: 'Our projects',
    primaryHref: '/projects',
    secondaryLabel: 'About the club',
    secondaryHref: '/about',
    sortOrder: 1,
    active: true,
  },
  {
    eyebrow: 'Updated every week',
    title: 'See the work as it happens',
    imageUrl: '/hero-camp.jpg',
    primaryLabel: 'Projects',
    primaryHref: '/projects',
    secondaryLabel: 'Newsletter',
    secondaryHref: '/newsletters',
    sortOrder: 2,
    active: true,
  },
];

async function createIfMissing<T extends { slug?: string; key?: string }>(
  find: () => Promise<unknown>,
  create: () => Promise<T>,
) {
  const existing = await find();
  if (!existing) await create();
}

export async function seed() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@lionsnugegoda.org').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'LionsNugegoda#2026';
  const name = process.env.SEED_ADMIN_NAME || 'Club Secretary';

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 12),
        role: 'admin',
      },
    });
  }

  for (const [key, value] of Object.entries(settings)) {
    await createIfMissing(
      () => prisma.setting.findUnique({ where: { key } }),
      () => prisma.setting.create({ data: { key, value } }),
    );
  }

  for (const page of pages) {
    await createIfMissing(
      () => prisma.page.findUnique({ where: { slug: page.slug } }),
      () => prisma.page.create({ data: page }),
    );
  }

  for (const project of projects) {
    await createIfMissing(
      () => prisma.project.findUnique({ where: { slug: project.slug } }),
      () => prisma.project.create({ data: { ...project, coverImage: '' } }),
    );
  }

  for (const newsletter of newsletters) {
    await createIfMissing(
      () => prisma.newsletter.findUnique({ where: { slug: newsletter.slug } }),
      () => prisma.newsletter.create({ data: newsletter }),
    );
  }

  const slideCount = await prisma.slide.count();
  if (slideCount === 0) {
    await prisma.slide.createMany({ data: slides });
  }
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').includes('prisma/seed');
if (isDirect) {
  seed()
    .then(() => {
      console.log('Seed complete.');
      return prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
