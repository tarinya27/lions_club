import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../api';
import { Banner } from '../../components/ui';

type DashboardData = {
  projectCount: number;
  newsletterCount: number;
  unreadMessages: number;
  sampleCount: number;
  projectStale: boolean;
  newsletterStale: boolean;
  latestProject: { title: string; projectDate: string; slug: string } | null;
  latestNewsletter: { title: string; issueDate: string; slug: string } | null;
  projects: { id: string; title: string; status: string; projectDate: string; isSample: boolean }[];
  newsletters: { id: string; title: string; status: string; issueDate: string; isSample: boolean }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function load() {
    api<DashboardData>('/api/admin/dashboard').then(setData).catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function removeSamples() {
    if (!window.confirm('Remove every sample project and newsletter from the site?')) return;
    await api('/api/admin/samples', { method: 'DELETE' });
    setNotice('Sample entries have been removed.');
    load();
  }

  if (error) return <Banner kind="err">{error}</Banner>;
  if (!data) return <p className="muted">Loading the dashboard…</p>;

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Dashboard</p>
          <h1>This week</h1>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-navy" to="/admin/projects/new">New project</Link>
          <Link className="btn btn-gold" to="/admin/newsletters/new">New newsletter</Link>
        </div>
      </header>
      {notice ? <Banner kind="ok">{notice}</Banner> : null}
      {data.sampleCount > 0 ? (
        <Banner kind="warn">
          Sample projects and newsletters are still on the public site. Replace them with real reports before you share the address.
          <button className="text-button" type="button" onClick={removeSamples}>Remove sample content</button>
        </Banner>
      ) : null}
      {data.projectStale ? <Banner kind="warn">No real project has been published in the last 7 days.</Banner> : null}
      {data.newsletterStale ? <Banner kind="warn">No real newsletter has been published in the last 7 days.</Banner> : null}
      <div className="stat-grid">
        <article className="stat"><strong>{data.projectCount}</strong><span>Published projects</span></article>
        <article className="stat"><strong>{data.newsletterCount}</strong><span>Published newsletters</span></article>
        <article className="stat"><strong>{data.unreadMessages}</strong><span>Unread messages</span></article>
      </div>
      <div className="split">
        <section className="panel">
          <h2>Recent projects</h2>
          {data.latestProject ? <p className="muted">Latest real report: {data.latestProject.title} · {formatDate(data.latestProject.projectDate)}</p> : <p className="muted">No real project yet.</p>}
          <ul className="plain-list">
            {data.projects.map((item) => (
              <li key={item.id}>
                <Link to={`/admin/projects/${item.id}`}>{item.title}</Link>
                <span className={`status status-${item.status}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Recent newsletters</h2>
          {data.latestNewsletter ? <p className="muted">Latest real issue: {data.latestNewsletter.title} · {formatDate(data.latestNewsletter.issueDate)}</p> : <p className="muted">No real newsletter yet.</p>}
          <ul className="plain-list">
            {data.newsletters.map((item) => (
              <li key={item.id}>
                <Link to={`/admin/newsletters/${item.id}`}>{item.title}</Link>
                <span className={`status status-${item.status}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
