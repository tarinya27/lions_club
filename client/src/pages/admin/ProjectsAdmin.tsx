import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../api';

type Row = { id: string; title: string; slug: string; category: string; projectDate: string; status: string; isSample: boolean };

export default function ProjectsAdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Row[]>('/api/admin/projects').then(setRows).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Weekly update</p>
          <h1>Projects</h1>
        </div>
        <Link className="btn btn-navy" to="/admin/projects/new">New project</Link>
      </header>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="panel">
        <table className="table">
          <thead>
            <tr><th>Project</th><th>Category</th><th>Date</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {(rows || []).map((row) => (
              <tr key={row.id}>
                <td>{row.title}{row.isSample ? <span className="chip-sample">Sample</span> : null}</td>
                <td>{row.category}</td>
                <td>{formatDate(row.projectDate)}</td>
                <td><span className={`status status-${row.status}`}>{row.status}</span></td>
                <td><Link to={`/admin/projects/${row.id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows && rows.length === 0 ? <p className="muted">No projects yet.</p> : null}
      </div>
    </>
  );
}
