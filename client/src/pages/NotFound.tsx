import { Link } from 'react-router-dom';
import { useTitle } from '../components/ui';

export default function NotFoundPage() {
  useTitle('Page not found');
  return (
    <section className="section">
      <div className="wrap narrow">
        <p className="kicker">404</p>
        <h1>That page is not on this site</h1>
        <p>The address may be out of date. The projects and newsletter are the best place to start.</p>
        <Link className="btn btn-navy" to="/">Back to the home page</Link>
      </div>
    </section>
  );
}
