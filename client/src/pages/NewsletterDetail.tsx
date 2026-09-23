import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../api';
import { RichText, useTitle } from '../components/ui';
import { Newsletter } from '../types';

export default function NewsletterDetailPage() {
  const { slug = '' } = useParams();
  const [item, setItem] = useState<Newsletter | null>(null);
  const [error, setError] = useState('');
  useTitle(item?.title || 'Newsletter');

  useEffect(() => {
    setItem(null);
    setError('');
    api<Newsletter>(`/api/newsletters/${slug}`).then(setItem).catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <h1>Newsletter not found</h1>
          <p>{error}</p>
          <Link className="text-link" to="/newsletters">Back to newsletters</Link>
        </div>
      </section>
    );
  }

  if (!item) {
    return <section className="section"><div className="wrap"><p className="muted">Loading…</p></div></section>;
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap narrow">
          <p className="kicker">Newsletter</p>
          <h1>{item.title}</h1>
          <p className="meta">
            <span>{formatDate(item.issueDate)}</span>
            {item.isSample ? <span className="chip-sample">Sample</span> : null}
          </p>
        </div>
      </header>
      <section className="section">
        <div className="wrap narrow article">
          {item.coverImage ? <img className="feature-photo" src={item.coverImage} alt="" /> : null}
          <p className="lede">{item.summary}</p>
          <RichText text={item.body} />
          {item.pdfUrl ? (
            <p>
              <a className="btn btn-navy" href={item.pdfUrl} target="_blank" rel="noreferrer">Download the PDF</a>
            </p>
          ) : null}
          <Link className="text-link" to="/newsletters">All newsletters</Link>
        </div>
      </section>
    </>
  );
}
