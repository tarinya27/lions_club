import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../api';
import { Banner, Field } from '../../components/ui';
import { PageContent } from '../../types';

export default function PagesAdminPage() {
  const slug = 'club-house';
  const [page, setPage] = useState<PageContent | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotice('');
    api<PageContent>(`/api/admin/pages/${slug}`).then(setPage).catch((err) => setError(err.message));
  }, [slug]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!page) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const saved = await api<PageContent>(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ title: page.title, excerpt: page.excerpt, body: page.body }),
      });
      setPage(saved);
      setNotice('Page saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the page.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Pages</p>
          <h1>Club house</h1>
        </div>
      </header>
      {error ? <Banner kind="err">{error}</Banner> : null}
      {notice ? <Banner kind="ok">{notice}</Banner> : null}
      {page ? (
        <form className="panel form" onSubmit={onSubmit}>
          <Field label="Title"><input value={page.title} onChange={(event) => setPage({ ...page, title: event.target.value })} required /></Field>
          <Field label="Short introduction"><textarea rows={2} value={page.excerpt} onChange={(event) => setPage({ ...page, excerpt: event.target.value })} /></Field>
          <Field label="Page text" hint="Separate paragraphs with a blank line. Start a line with ## for a heading, or - for a list.">
            <textarea rows={16} value={page.body} onChange={(event) => setPage({ ...page, body: event.target.value })} required />
          </Field>
          <button className="btn btn-navy" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save page'}</button>
        </form>
      ) : (
        <p className="muted">Loading…</p>
      )}
    </>
  );
}
