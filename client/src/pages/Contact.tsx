import { FormEvent, useState } from 'react';
import { api } from '../api';
import { useSettings } from '../components/PublicLayout';
import { Banner, useTitle } from '../components/ui';

export default function ContactPage() {
  useTitle('Contact us');
  const settings = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', body: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify(form) });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The message could not be sent.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Contact us</p>
          <h1>Write to the club</h1>
          <p>For membership, a project, or a visit to the club house.</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap contact-grid">
          <div className="side-card">
            <p><span className="footer-label">Telephone</span><br />{[settings.phone, settings.phoneAlt].filter(Boolean).join(' / ')}</p>
            <p><span className="footer-label">Email</span><br /><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p><span className="footer-label">Club house</span><br />{settings.address}</p>
          </div>
          {done ? (
            <Banner kind="ok">Thank you. The club has your message and will reply by email.</Banner>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              {error ? <Banner kind="err">{error}</Banner> : null}
              <div className="field-row">
                <label className="field">Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
                <label className="field">Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
              </div>
              <div className="field-row">
                <label className="field">Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label className="field">Subject<input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required /></label>
              </div>
              <label className="field">Message<textarea rows={7} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} required /></label>
              <button className="btn btn-blue" disabled={busy} type="submit">{busy ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
        <div className="wrap map-block">
          <div className="map-frame">
            <iframe
              title="Map of Lions Club of Nugegoda"
              src="https://maps.google.com/maps?q=6.8955153,79.8932658&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p>
            <a className="text-link" href="https://maps.app.goo.gl/9xLco7KuMGEptRv5A" target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
