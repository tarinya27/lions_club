import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Hero from '../components/Hero';
import { LeadProject, NewsletterRow, ProjectCard } from '../components/Cards';
import { useSettings } from '../components/PublicLayout';
import { useTitle } from '../components/ui';
import { NewsletterSummary, ProjectSummary, Slide } from '../types';

const causes = [
  { name: 'Vision', text: 'Eye care and the chance to see clearly.' },
  { name: 'Hunger', text: 'Practical help when food is the need.' },
  { name: 'Environment', text: 'Care for the streets and places we share.' },
  { name: 'Youth', text: 'Time, encouragement, and support in schools.' },
  { name: 'Health', text: 'Screenings and quiet help close to home.' },
];

type HomeData = {
  slides: Slide[];
  projects: ProjectSummary[];
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

  const projects = data?.projects ?? [];
  const [lead, ...rest] = projects;
  const samplesOnly = projects.length > 0 && projects.every((project) => project.isSample);

  return (
    <>
      <Hero slides={data?.slides ?? []} />
      <section className="section">
        <div className="wrap intro">
          <div>
            <p className="kicker">The club</p>
            <h2>{settings.homeHeading}</h2>
            <p className="lede">{settings.homeIntro}</p>
            <Link className="text-link" to="/about">About the club</Link>
          </div>
          <aside className="we-serve">
            <p>We Serve</p>
            <span>The motto of Lions Clubs International, kept locally in Nugegoda and Nawala.</span>
          </aside>
        </div>
      </section>
      <section className="section section-tight">
        <div className="wrap">
          <div className="causes">
            {causes.map((cause) => (
              <article key={cause.name} className="cause">
                <h3>{cause.name}</h3>
                <p>{cause.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
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
          {!error && data && projects.length === 0 ? <p className="muted">The next project report will appear here.</p> : null}
          {lead ? <LeadProject project={lead} /> : null}
          {rest.length > 0 ? (
            <div className="project-grid">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <section className="section section-news">
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
      <section className="section">
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
