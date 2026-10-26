import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ClubHistory from '../components/ClubHistory';
import Hero from '../components/Hero';
import { NewsletterRow, ProjectCard } from '../components/Cards';
import { useSettings } from '../components/PublicLayout';
import { useTitle } from '../components/ui';
import { NewsletterSummary, ProjectSummary, Slide } from '../types';

const purpose = [
  {
    name: 'Vision',
    text: 'To empower volunteers to serve their communities, meet humanitarian needs, encourage peace and promote international understanding through Lions clubs.',
  },
  {
    name: 'Mission',
    text: 'Our mission is to empower Lions clubs, volunteers, and partners to improve health, strengthen communities, and support those in need through global humanitarian services and grants, fostering peace and international understanding.',
  },
];

type HomeData = {
  slides: Slide[];
  upcoming: ProjectSummary[];
  past: ProjectSummary[];
  newsletter: NewsletterSummary | null;
};

export default function HomePage() {
  useTitle('Home');
  const settings = useSettings();
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<HomeData>('/api/home').then(setData).catch((err) => setError(err.message));
  }, []);

  const upcoming = data?.upcoming ?? [];
  const past = data?.past ?? [];
  const samplesOnly = upcoming.length + past.length > 0 && [...upcoming, ...past].every((project) => project.isSample);

  return (
    <>
      <Hero slides={data?.slides ?? []} />
      <section className="section section-purpose home-flow">
        <div className="wrap purpose-grid">
          {purpose.map((item) => (
            <article key={item.name} className="purpose">
              <h2>{item.name}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ClubHistory />
      <section className="section home-flow">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">Updated every week</p>
              <h2>Projects</h2>
            </div>
            <Link className="text-link" to="/projects">All projects</Link>
          </div>
          {error ? <p className="muted">{error}</p> : null}
          {samplesOnly ? <p className="sample-note">Sample reports are showing so the layout is visible. The club replaces them with the real weekly update.</p> : null}
          <div className="project-group" id="upcoming">
            <h3>Upcoming projects</h3>
            {data && upcoming.length === 0 ? <p className="muted">Upcoming projects will be published here.</p> : null}
            {upcoming.length > 0 ? (
              <div className="project-grid">
                {upcoming.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : null}
          </div>
          <div className="project-group" id="past">
            <h3>Past projects</h3>
            {data && past.length === 0 ? <p className="muted">Past projects will be published here.</p> : null}
            {past.length > 0 ? (
              <div className="project-grid">
                {past.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <section className="section section-news home-flow">
        <div className="wrap news-feature">
          <div>
            <p className="kicker">Newsletter</p>
            <h2>{data?.newsletter ? data.newsletter.title : 'The weekly note'}</h2>
            <p className="lede">
              {data?.newsletter?.summary || 'A short letter from the club — the latest project, the next meeting, and how to take part.'}
            </p>
            <Link className="btn btn-navy" to={data?.newsletter ? `/newsletters/${data.newsletter.slug}` : '/newsletters'}>
              {data?.newsletter ? 'Read this issue' : 'Newsletter archive'}
            </Link>
          </div>
          {data?.newsletter ? <NewsletterRow item={data.newsletter} /> : null}
        </div>
      </section>
      <section className="section section-visit home-flow">
        <div className="wrap visit-grid">
          <article className="visit-card">
            <p className="kicker">Club house</p>
            <h2>Come to School Lane</h2>
            <p>{settings.address}</p>
            <p>{settings.meetingWhen || 'Ask the secretary for the next meeting before you visit.'}</p>
            <Link className="text-link" to="/club-house">Club house</Link>
          </article>
          <article className="visit-card visit-gold">
            <p className="kicker">Support</p>
            <h2>Help a project</h2>
            <p>Donations pay for the work members carry out in the community. The treasurer keeps the account details on this site.</p>
            <Link className="btn btn-navy" to="/donations">Donations</Link>
          </article>
        </div>
      </section>
    </>
  );
}
