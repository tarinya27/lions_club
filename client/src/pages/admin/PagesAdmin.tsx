import { Link } from 'react-router-dom';

export default function PagesAdminPage() {
  return (
    <>
      <header className="admin-top">
        <div>
          <p className="kicker">Pages</p>
          <h1>Club house</h1>
        </div>
      </header>
      <section className="panel">
        <p>The club house page shows the facilities.</p>
        <p>Address, telephone, email, and meeting details are on the Contact page. Change them in <Link to="/admin/settings">Settings</Link>.</p>
      </section>
    </>
  );
}
