import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../api';

type Row = { id: string; title: string; issueDate: string; status: string; isSample: boolean; pdfUrl: string };

export default function NewslettersAdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Row[]>('/api/admin/newsletters').then(setRows).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Weekly update</p>
          <h1>Newsletters</h1>
        </div>
        <Link className="btn btn-navy" to="/admin/newsletters/new">New newsletter</Link>
      </header>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="panel">
        <table className="table">
          <thead>
            <tr><th>Issue</th><th>Date</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {(rows || []).map((row) => (
              <tr key={row.id}>
                <td>{row.title}{row.isSample ? <span className="chip-sample">Sample</span> : null}</td>
                <td>{formatDate(row.issueDate)}</td>
                <td><span className={`status status-${row.status}`}>{row.status}</span></td>
                <td><Link to={`/admin/newsletters/${row.id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows && rows.length === 0 ? <p className="muted">No newsletters yet.</p> : null}
      </div>
    </>
  );
}
