import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Banner } from '../../components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@lionsnugegoda.org');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <section className="login-copy">
        <p className="kicker">Club admin</p>
        <h1>Lions Club of Nugegoda</h1>
        <p>Publish this week’s project and newsletter. The public site updates as soon as you do.</p>
      </section>
      <form className="login-panel" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        {error ? <Banner kind="err">{error}</Banner> : null}
        <label className="field">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="field">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="btn btn-gold" disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link className="text-link" to="/">Back to the website</Link>
      </form>
    </div>
  );
}
