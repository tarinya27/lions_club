import { Link } from 'react-router-dom';
import { useSettings } from '../components/PublicLayout';
import { useTitle } from '../components/ui';

export default function DonationsPage() {
  useTitle('Donations');
  const settings = useSettings();
  const ready = Boolean(settings.donationBank && settings.donationAccountNumber);

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Donations</p>
          <h1>Help the club serve</h1>
          <p>Gifts are used for service projects in Nugegoda, Nawala, and nearby communities.</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap donation-layout">
          <article className="article">
            <p>{settings.donationNote}</p>
            <p>If you would like the gift to support a particular project, say so when you write to the treasurer. The club will acknowledge it.</p>
            <Link className="text-link" to="/contact">Contact the club</Link>
          </article>
          <aside className="donation-card">
            <p className="kicker">Bank details</p>
            {ready ? (
              <dl>
                <div><dt>Bank</dt><dd>{settings.donationBank}</dd></div>
                <div><dt>Branch</dt><dd>{settings.donationBranch || '—'}</dd></div>
                <div><dt>Account name</dt><dd>{settings.donationAccountName}</dd></div>
                <div><dt>Account number</dt><dd>{settings.donationAccountNumber}</dd></div>
              </dl>
            ) : (
              <p>The treasurer has not published the account details yet. Write to the club and the secretary will send them.</p>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
