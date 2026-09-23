import { useEffect, useState } from 'react';
import { api, formatDate } from '../../api';
import { ContactMessage } from '../../types';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState('');

  function load() {
    api<ContactMessage[]>('/api/admin/messages').then(setMessages).catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function open(message: ContactMessage) {
    setOpenId(message.id === openId ? null : message.id);
    if (!message.isRead) {
      await api(`/api/admin/messages/${message.id}`, { method: 'PATCH', body: JSON.stringify({ isRead: true }) });
      load();
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this message?')) return;
    await api(`/api/admin/messages/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Inbox</p>
          <h1>Messages</h1>
        </div>
      </header>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="panel">
        {(messages || []).map((message) => (
          <article key={message.id} className={`message ${message.isRead ? 'read' : ''}`}>
            <button type="button" className="message-summary" onClick={() => open(message)}>
              <strong>{message.subject}</strong>
              <span>{message.name} · {formatDate(message.createdAt)}</span>
            </button>
            {openId === message.id ? (
              <div className="message-body">
                <p>{message.body}</p>
                <p className="muted">{message.email}{message.phone ? ` · ${message.phone}` : ''}</p>
                <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}>Reply by email</a>
                <button className="text-button danger" type="button" onClick={() => remove(message.id)}>Delete</button>
              </div>
            ) : null}
          </article>
        ))}
        {messages && messages.length === 0 ? <p className="muted">No messages yet.</p> : null}
      </div>
    </>
  );
}
