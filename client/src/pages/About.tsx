import { useEffect, useState } from 'react';
import { api } from '../api';
import { useSettings } from '../components/PublicLayout';
import { RichText, useTitle } from '../components/ui';
import { PageContent } from '../types';

export default function AboutPage() {
  useTitle('About us');
  const settings = useSettings();
  const [page, setPage] = useState<PageContent | null>(null);
  const bearers = settings.officeBearers.filter((person) => person.name.trim());

  useEffect(() => {
    api<PageContent>('/api/pages/about').then(setPage).catch(() => {});
  }, []);

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">About us</p>
          <h1>{page?.title || 'About the club'}</h1>
          <p>{page?.excerpt}</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap article-grid">
          <article className="article">{page ? <RichText text={page.body} /> : <p className="muted">Loading…</p>}</article>
          <aside className="side-card" id="bearers">
            <p className="kicker">This Lions year</p>
            <h2>Office bearers</h2>
            {bearers.length === 0 ? (
              <p>The secretary publishes this year’s board here. The Lions year runs from July to June.</p>
            ) : (
              <ul className="bearers">
                {bearers.map((person) => (
                  <li key={person.role}>
                    <span>{person.role}</span>
                    <strong>{person.name}</strong>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
