import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../api';
import { Banner, Field } from '../../components/ui';
import { ClubPerson, Settings } from '../../types';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Settings>('/api/admin/settings')
      .then((data) => setSettings({ ...data, pastLeaders: data.pastLeaders ?? [], members: data.members ?? [] }))
      .catch((err) => setError(err.message));
  }, []);

  function patch(partial: Partial<Settings>) {
    setSettings((current) => (current ? { ...current, ...partial } : current));
  }

  function updatePerson(key: 'pastLeaders' | 'members', index: number, partial: Partial<ClubPerson>) {
    if (!settings) return;
    const people = settings[key].map((person, personIndex) => (personIndex === index ? { ...person, ...partial } : person));
    patch({ [key]: people });
  }

  function addPerson(key: 'pastLeaders' | 'members') {
    if (!settings) return;
    patch({ [key]: [...settings[key], { name: '', detail: '' }] });
  }

  function removePerson(key: 'pastLeaders' | 'members', index: number) {
    if (!settings) return;
    patch({ [key]: settings[key].filter((_, personIndex) => personIndex !== index) });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const saved = await api<Settings>('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
      setSettings(saved);
      setNotice('Settings saved. The public site is using them now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      await api('/api/auth/password', { method: 'POST', body: JSON.stringify(password) });
      setPassword({ currentPassword: '', newPassword: '' });
      setNotice('Password changed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password.');
    }
  }

  if (!settings) return <p className="muted">{error || 'Loading settings…'}</p>;

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Club details</p>
          <h1>Settings</h1>
        </div>
      </header>
      {error ? <Banner kind="err">{error}</Banner> : null}
      {notice ? <Banner kind="ok">{notice}</Banner> : null}
      <form className="panel form" onSubmit={onSubmit}>
        <h2>Contact</h2>
        <div className="field-row">
          <Field label="Telephone"><input value={settings.phone} onChange={(event) => patch({ phone: event.target.value })} /></Field>
          <Field label="Second telephone"><input value={settings.phoneAlt} onChange={(event) => patch({ phoneAlt: event.target.value })} /></Field>
        </div>
        <Field label="Email"><input type="email" value={settings.email} onChange={(event) => patch({ email: event.target.value })} required /></Field>
        <Field label="Address"><input value={settings.address} onChange={(event) => patch({ address: event.target.value })} required /></Field>
        <Field label="Facebook page" hint="Leave blank to hide the icon. Use a full https link.">
          <input value={settings.facebook} onChange={(event) => patch({ facebook: event.target.value })} placeholder="https://" />
        </Field>
        <h2>Meetings</h2>
        <Field label="When the club meets" hint="Example: Second Tuesday of the month, 7.00 pm">
          <input value={settings.meetingWhen} onChange={(event) => patch({ meetingWhen: event.target.value })} />
        </Field>
        <Field label="Where"><input value={settings.meetingWhere} onChange={(event) => patch({ meetingWhere: event.target.value })} /></Field>
        <h2>Home page</h2>
        <Field label="Motto"><input value={settings.tagline} onChange={(event) => patch({ tagline: event.target.value })} /></Field>
        <Field label="Heading"><input value={settings.homeHeading} onChange={(event) => patch({ homeHeading: event.target.value })} /></Field>
        <Field label="Introduction"><textarea rows={4} value={settings.homeIntro} onChange={(event) => patch({ homeIntro: event.target.value })} /></Field>
        <Field label="Footer text"><textarea rows={3} value={settings.footerBlurb} onChange={(event) => patch({ footerBlurb: event.target.value })} /></Field>
        <h2>Donations</h2>
        <div className="field-row">
          <Field label="Bank"><input value={settings.donationBank} onChange={(event) => patch({ donationBank: event.target.value })} /></Field>
          <Field label="Branch"><input value={settings.donationBranch} onChange={(event) => patch({ donationBranch: event.target.value })} /></Field>
        </div>
        <div className="field-row">
          <Field label="Account name"><input value={settings.donationAccountName} onChange={(event) => patch({ donationAccountName: event.target.value })} /></Field>
          <Field label="Account number"><input value={settings.donationAccountNumber} onChange={(event) => patch({ donationAccountNumber: event.target.value })} /></Field>
        </div>
        <Field label="Note on the donations page"><textarea rows={3} value={settings.donationNote} onChange={(event) => patch({ donationNote: event.target.value })} /></Field>
        <h2>Meet our Past Leaders</h2>
        <p className="muted">Past presidents from 1966 to 2025 are published on the About page.</p>
        <h2>Meet our members</h2>
        {settings.members.map((person, index) => (
          <div className="field-row person-edit" key={`member-${index}`}>
            <Field label="Name"><input value={person.name} onChange={(event) => updatePerson('members', index, { name: event.target.value })} /></Field>
            <Field label="Detail">
              <input value={person.detail} onChange={(event) => updatePerson('members', index, { detail: event.target.value })} />
            </Field>
            <button className="text-button danger" type="button" onClick={() => removePerson('members', index)}>Remove</button>
          </div>
        ))}
        <button className="text-button" type="button" onClick={() => addPerson('members')}>Add a member</button>
        <div className="admin-actions">
          <button className="btn btn-navy" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save settings'}</button>
        </div>
      </form>
      <form className="panel form" onSubmit={changePassword}>
        <h2>Change password</h2>
        <div className="field-row">
          <Field label="Current password"><input type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} required /></Field>
          <Field label="New password"><input type="password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} required /></Field>
        </div>
        <button className="btn btn-gold" type="submit">Update password</button>
      </form>
    </>
  );
}
