import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, todayKey } from '../../api';
import { Banner, Field, Uploader } from '../../components/ui';
import { Newsletter } from '../../types';

type FormState = {
  title: string;
  summary: string;
  body: string;
  issueDate: string;
  coverImage: string;
  pdfUrl: string;
  status: 'draft' | 'published';
  isSample: boolean;
};

const empty = (): FormState => ({
  title: '',
  summary: '',
  body: '',
  issueDate: todayKey(),
  coverImage: '',
  pdfUrl: '',
  status: 'draft',
  isSample: false,
});

export default function NewsletterEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api<Newsletter & { issueDate: string }>(`/api/admin/newsletters/${id}`)
      .then((item) => {
        setSlug(item.slug);
        setForm({
          title: item.title,
          summary: item.summary,
          body: item.body,
          issueDate: item.issueDate.slice(0, 10),
          coverImage: item.coverImage,
          pdfUrl: item.pdfUrl,
          status: item.status === 'published' ? 'published' : 'draft',
          isSample: item.isSample,
        });
      })
      .catch((err) => setError(err.message));
  }, [id, isNew]);

  function patch(partial: Partial<FormState>) {
    setForm((current) => ({ ...current, ...partial }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const saved = await api<Newsletter>(isNew ? '/api/admin/newsletters' : `/api/admin/newsletters/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify(form),
      });
      setSaved(true);
      setSlug(saved.slug);
      if (isNew) navigate(`/admin/newsletters/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the newsletter.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (isNew || !window.confirm('Delete this newsletter?')) return;
    await api(`/api/admin/newsletters/${id}`, { method: 'DELETE' });
    navigate('/admin/newsletters');
  }

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Newsletter</p>
          <h1>{isNew ? 'New newsletter' : 'Edit newsletter'}</h1>
        </div>
        <Link className="text-link" to="/admin/newsletters">All newsletters</Link>
      </header>
      <form className="panel form" onSubmit={onSubmit}>
        {error ? <Banner kind="err">{error}</Banner> : null}
        {saved ? <Banner kind="ok">Newsletter saved.</Banner> : null}
        <Field label="Title"><input value={form.title} onChange={(event) => patch({ title: event.target.value })} required /></Field>
        <Field label="Issue date"><input type="date" value={form.issueDate} onChange={(event) => patch({ issueDate: event.target.value })} required /></Field>
        <Field label="Summary"><textarea rows={3} value={form.summary} onChange={(event) => patch({ summary: event.target.value })} required /></Field>
        <Field label="Letter" hint="Separate paragraphs with a blank line. Start a line with ## for a heading, or - for a list.">
          <textarea rows={14} value={form.body} onChange={(event) => patch({ body: event.target.value })} required />
        </Field>
        <Uploader label="Cover image" accept="image/jpeg,image/png,image/webp" value={form.coverImage} onUploaded={(url) => patch({ coverImage: url })} />
        <Uploader label="PDF of the printed issue" accept="application/pdf" value={form.pdfUrl} onUploaded={(url) => patch({ pdfUrl: url })} />
        <label className="checks"><input type="checkbox" checked={form.isSample} onChange={(event) => patch({ isSample: event.target.checked })} /> Mark as sample</label>
        <Field label="Status">
          <select value={form.status} onChange={(event) => patch({ status: event.target.value as FormState['status'] })}>
            <option value="draft">Draft — hidden from the public site</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <div className="admin-actions">
          <button className="btn btn-navy" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save newsletter'}</button>
          {!isNew && slug && form.status === 'published' ? <Link className="text-link" to={`/newsletters/${slug}`} target="_blank">View on the site</Link> : null}
          {!isNew ? <button className="text-button danger" type="button" onClick={onDelete}>Delete</button> : null}
        </div>
      </form>
    </>
  );
}
