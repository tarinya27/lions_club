import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../api';
import { Banner, Field, Uploader } from '../../components/ui';
import { Slide } from '../../types';

const blank = (): Slide => ({
  eyebrow: 'Lions Club of Nugegoda',
  title: '',
  imageUrl: '',
  primaryLabel: 'Donations',
  primaryHref: '/donations',
  secondaryLabel: 'Newsletter',
  secondaryHref: '/newsletters',
  sortOrder: 0,
  active: true,
});

export default function SlidesAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [draft, setDraft] = useState<Slide>(blank);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function load() {
    api<Slide[]>('/api/admin/slides').then(setSlides).catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(slide: Slide) {
    setEditing(slide.id || 'new');
    setDraft(slide);
    setNotice('');
    setError('');
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      if (editing === 'new') {
        await api('/api/admin/slides', { method: 'POST', body: JSON.stringify({ ...draft, sortOrder: slides.length }) });
      } else {
        await api(`/api/admin/slides/${editing}`, { method: 'PUT', body: JSON.stringify(draft) });
      }
      setEditing(null);
      setNotice('Homepage slide saved.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the slide.');
    }
  }

  async function remove(id?: string) {
    if (!id || !window.confirm('Remove this slide?')) return;
    await api(`/api/admin/slides/${id}`, { method: 'DELETE' });
    load();
  }

  async function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= slides.length) return;
    const current = slides[index];
    const other = slides[next];
    await api(`/api/admin/slides/${current.id}`, { method: 'PUT', body: JSON.stringify({ ...current, sortOrder: other.sortOrder }) });
    await api(`/api/admin/slides/${other.id}`, { method: 'PUT', body: JSON.stringify({ ...other, sortOrder: current.sortOrder }) });
    load();
  }

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Homepage</p>
          <h1>Hero slides</h1>
        </div>
        <button className="btn btn-navy" type="button" onClick={() => startEdit(blank())}>New slide</button>
      </header>
      {notice ? <Banner kind="ok">{notice}</Banner> : null}
      {error ? <Banner kind="err">{error}</Banner> : null}
      <div className="panel">
        {slides.map((slide, index) => (
          <article key={slide.id} className="slide-row">
            <div>
              <strong>{slide.title}</strong>
              <p className="muted">{slide.active ? 'Showing' : 'Hidden'} · {slide.primaryLabel} and {slide.secondaryLabel}</p>
            </div>
            <div className="admin-actions">
              <button className="text-button" type="button" onClick={() => move(index, -1)}>Up</button>
              <button className="text-button" type="button" onClick={() => move(index, 1)}>Down</button>
              <button className="text-button" type="button" onClick={() => startEdit(slide)}>Edit</button>
              <button className="text-button danger" type="button" onClick={() => remove(slide.id)}>Delete</button>
            </div>
          </article>
        ))}
        {slides.length === 0 ? <p className="muted">Add a slide to fill the top of the home page.</p> : null}
      </div>
      {editing ? (
        <form className="panel form" onSubmit={onSubmit}>
          <h2>{editing === 'new' ? 'New slide' : 'Edit slide'}</h2>
          <Field label="Small line above the headline"><input value={draft.eyebrow} onChange={(event) => setDraft({ ...draft, eyebrow: event.target.value })} /></Field>
          <Field label="Headline"><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></Field>
          <Uploader label="Background photograph" accept="image/jpeg,image/png,image/webp" value={draft.imageUrl} onUploaded={(url) => setDraft({ ...draft, imageUrl: url })} />
          <div className="field-row">
            <Field label="Blue button label"><input value={draft.primaryLabel} onChange={(event) => setDraft({ ...draft, primaryLabel: event.target.value })} required /></Field>
            <Field label="Blue button link"><input value={draft.primaryHref} onChange={(event) => setDraft({ ...draft, primaryHref: event.target.value })} required /></Field>
          </div>
          <div className="field-row">
            <Field label="Gold button label"><input value={draft.secondaryLabel} onChange={(event) => setDraft({ ...draft, secondaryLabel: event.target.value })} required /></Field>
            <Field label="Gold button link"><input value={draft.secondaryHref} onChange={(event) => setDraft({ ...draft, secondaryHref: event.target.value })} required /></Field>
          </div>
          <label className="checks"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Show this slide</label>
          <div className="admin-actions">
            <button className="btn btn-navy" type="submit">Save slide</button>
            <button className="text-button" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      ) : null}
    </>
  );
}
