import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { api } from '../api';

export function Mark() {
  return (
    <span className="mark">
      <img src="/logo.jpg" alt="" />
    </span>
  );
}

export function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16.5 L20 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4.5 h2.2 l1.2 3.2 -1.7 1.1 a12 12 0 0 0 5.5 5.5 l1.1 -1.7 3.2 1.2 v2.2 c0 .8 -.7 1.6 -1.6 1.5 A14.5 14.5 0 0 1 6.5 6.1 C6.4 5.2 7.2 4.5 8 4.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7 l8 6 8 -6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21 s6.5 -6.2 6.5 -10.2 a6.5 6.5 0 0 0 -13 0 C5.5 14.8 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 9 h2.5 V6 H14 c-2.2 0 -3.5 1.4 -3.5 3.6 V12 H8 v3 h2.5 v6 H14 v-6 h2.4 l.5 -3 H14 V9.8 c0 -.5 .2 -.8 .8 -.8z" fill="currentColor" />
    </svg>
  );
}

export function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19 s-7 -4.4 -7 -9 a4 4 0 0 1 7 -2 a4 4 0 0 1 7 2 c0 4.6 -7 9 -7 9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      ) : (
        <path d="M4 7 h16 M4 12 h16 M4 17 h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="rich">
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        if (lines.length === 1 && lines[0].startsWith('## ')) {
          return <h3 key={index}>{lines[0].slice(3)}</h3>;
        }
        if (lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={index}>
              {lines.map((line) => (
                <li key={line}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={line}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function Cover({ src, label }: { src?: string; label: string }) {
  if (src) return <img src={src} alt="" />;
  return (
    <div className="cover-fallback" aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function Banner({ kind, children }: { kind: 'ok' | 'err' | 'warn'; children: ReactNode }) {
  return <div className={`banner banner-${kind}`}>{children}</div>;
}

export function Uploader({
  label,
  accept,
  value,
  onUploaded,
}: {
  label: string;
  accept: string;
  value?: string;
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onChange(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    setBusy(true);
    setError('');
    try {
      const result = await api<{ url: string }>('/api/admin/upload', { method: 'POST', body });
      onUploaded(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  const isImage = value && !value.toLowerCase().endsWith('.pdf');

  return (
    <div className="uploader">
      <span>{label}</span>
      {isImage ? <img className="thumb" src={value} alt="" /> : null}
      {value && !isImage ? <a href={value} target="_blank" rel="noreferrer">Current file</a> : null}
      <input type="file" accept={accept} onChange={onChange} disabled={busy} />
      {busy ? <small>Uploading…</small> : null}
      {error ? <small className="form-error">{error}</small> : null}
      {value ? (
        <button type="button" className="text-button" onClick={() => onUploaded('')}>
          Remove file
        </button>
      ) : null}
    </div>
  );
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Home' ? 'Lions Club of Nugegoda' : `${title} · Lions Club of Nugegoda`;
  }, [title]);
}
