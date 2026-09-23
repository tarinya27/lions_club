import { useEffect, useState } from 'react';
import { api } from '../api';
import { NewsletterRow } from '../components/Cards';
import { useTitle } from '../components/ui';
import { NewsletterSummary } from '../types';

export default function NewslettersPage() {
  useTitle('Newsletters');
  const [items, setItems] = useState<NewsletterSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<NewsletterSummary[]>('/api/newsletters').then(setItems).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">From the club</p>
          <h1>Newsletters</h1>
          <p>A weekly note for members and friends: what was done, what is next, and how to help.</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap narrow">
          {error ? <p className="muted">{error}</p> : null}
          {items && items.length === 0 ? <p className="muted">The first newsletter will appear here.</p> : null}
          <div className="news-list">
            {(items || []).map((item) => (
              <NewsletterRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
