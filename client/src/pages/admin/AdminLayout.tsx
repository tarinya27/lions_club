import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { AuthUser } from '../../types';

export default function AdminLayout() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    api<AuthUser>('/api/auth/me').then(setUser).catch(() => setUser(null));
  }, []);

  async function logout(event: FormEvent) {
    event.preventDefault();
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    navigate('/admin/login');
  }

  if (user === undefined) {
    return <div className="admin-loading">Opening the admin panel…</div>;
  }
  if (user === null) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <aside className="side">
        <Link to="/" className="side-brand">
          <strong>Lions Club</strong>
          <span>of Nugegoda</span>
        </Link>
        <p className="side-user">{user.name}</p>
        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/projects">Projects</NavLink>
          <NavLink to="/admin/newsletters">Newsletters</NavLink>
          <NavLink to="/admin/slides">Homepage</NavLink>
          <NavLink to="/admin/pages">Pages</NavLink>
          <NavLink to="/admin/messages">Messages</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
        </nav>
        <form onSubmit={logout}>
          <button className="text-button light" type="submit">Sign out</button>
        </form>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
