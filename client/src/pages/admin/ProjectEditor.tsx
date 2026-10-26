import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, todayKey } from '../../api';
import { Banner, Field, Uploader } from '../../components/ui';
import { Project, projectSection, projectSections } from '../../types';

type FormState = {
  title: string;
  summary: string;
  body: string;
  category: string;
  location: string;
  projectDate: string;
  coverImage: string;
  status: 'draft' | 'published';
  featured: boolean;
  isSample: boolean;
  images: { url: string; caption: string }[];
};

function empty(section: 'Past' | 'Upcoming' = 'Past'): FormState {
  return {
    title: '',
    summary: '',
    body: '',
    category: section,
    location: '',
    projectDate: todayKey(),
    coverImage: '',
    status: 'published',
    featured: false,
    isSample: false,
    images: [],
  };
}

function cardSummary(description: string) {
  return description.replace(/^#{1,6}\s+/gm, '').replace(/\s+/g, ' ').trim().slice(0, 400);
}

export default function ProjectEditorPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(() => empty(params.get('section') === 'upcoming' ? 'Upcoming' : 'Past'));
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api<Project & { projectDate: string }>(`/api/admin/projects/${id}`)
      .then((project) => {
        setSlug(project.slug);
        setForm({
          title: project.title,
          summary: project.summary,
          body: project.body,
          category: projectSection(project.category),
          location: project.location,
          projectDate: project.projectDate.slice(0, 10),
          coverImage: project.coverImage,
          status: project.status === 'published' ? 'published' : 'draft',
          featured: project.featured,
          isSample: project.isSample,
          images: project.images.map((image) => ({ url: image.url, caption: image.caption })),
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
    try {
      const saved = await api<Project>(isNew ? '/api/admin/projects' : `/api/admin/projects/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify({ ...form, category: projectSection(form.category), summary: cardSummary(form.body) }),
      });
      navigate(`/admin/projects/${saved.id}`);
      if (!isNew) setSlug(saved.slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the project.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (isNew || !window.confirm('Delete this project?')) return;
    await api(`/api/admin/projects/${id}`, { method: 'DELETE' });
    navigate('/admin/projects');
  }

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Project</p>
          <h1>{isNew ? 'New project' : 'Edit project'}</h1>
        </div>
        <Link className="text-link" to="/admin/projects">All projects</Link>
      </header>
      <form className="panel form" onSubmit={onSubmit}>
        {error ? <Banner kind="err">{error}</Banner> : null}
        <Field label="Title"><input value={form.title} onChange={(event) => patch({ title: event.target.value })} required /></Field>
        <div className="field-row">
          <Field label="Section">
            <select value={projectSection(form.category)} onChange={(event) => patch({ category: event.target.value })}>
              {projectSections.map((section) => <option key={section.value} value={section.value}>{section.label}</option>)}
            </select>
          </Field>
          <Field label="Project date"><input type="date" value={form.projectDate} onChange={(event) => patch({ projectDate: event.target.value })} required /></Field>
        </div>
        <Field label="Project description" hint="This is the text visitors read. Separate paragraphs with a blank line. Start a line with ## for a heading, or - for a list.">
          <textarea rows={14} value={form.body} onChange={(event) => patch({ body: event.target.value })} required />
        </Field>
        <Uploader label="Cover photograph" accept="image/jpeg,image/png,image/webp" value={form.coverImage} onUploaded={(url) => patch({ coverImage: url })} />
        <fieldset className="gallery-edit">
          <legend>Photographs</legend>
          {form.images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="gallery-row">
              <img src={image.url} alt="" />
              <input
                value={image.caption}
                placeholder="Caption"
                onChange={(event) => {
                  const images = form.images.slice();
                  images[index] = { ...image, caption: event.target.value };
                  patch({ images });
                }}
              />
              <button
                type="button"
                className="text-button"
                onClick={() => patch({ images: form.images.filter((_, imageIndex) => imageIndex !== index) })}
              >
                Remove
              </button>
            </div>
          ))}
          <Uploader
            label="Add a photograph"
            accept="image/jpeg,image/png,image/webp"
            onUploaded={(url) => {
              if (url) patch({ images: [...form.images, { url, caption: '' }] });
            }}
          />
        </fieldset>
        <div className="checks">
          <label><input type="checkbox" checked={form.isSample} onChange={(event) => patch({ isSample: event.target.checked })} /> Mark as sample</label>
        </div>
        <Field label="Status">
          <select value={form.status} onChange={(event) => patch({ status: event.target.value as FormState['status'] })}>
            <option value="draft">Draft — hidden from the public site</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <div className="admin-actions">
          <button className="btn btn-navy" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save project'}</button>
          {!isNew && slug && form.status === 'published' ? (
            <Link className="text-link" to={`/projects/${slug}`} target="_blank">View on the site</Link>
          ) : null}
          {!isNew ? <button className="text-button danger" type="button" onClick={onDelete}>Delete</button> : null}
        </div>
      </form>
    </>
  );
}
