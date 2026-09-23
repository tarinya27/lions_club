import { useEffect, useState } from 'react';
import { api } from '../api';
import { useSettings } from '../components/PublicLayout';
import { RichText, useTitle } from '../components/ui';
import { PageContent } from '../types';

export default function ClubHousePage() {
  useTitle('Club house');
  const settings = useSettings();
  const [page, setPage] = useState<PageContent | null>(null);
  const mapQuery = encodeURIComponent(settings.address || '02, School Lane, Nawala');

  useEffect(() => {
    api<PageContent>('/api/pages/club-house').then(setPage).catch(() => {});
  }, []);

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Club house</p>
          <h1>{page?.title || 'Club house'}</h1>
          <p>{page?.excerpt || settings.address}</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap article-grid">
          <article className="article">
            {page ? <RichText text={page.body} /> : <p className="muted">Loading…</p>}
            <div className="detail-list">
              <p><span>Address</span><strong>{settings.address}</strong></p>
              <p><span>Meetings</span><strong>{settings.meetingWhen || 'Announced by the secretary'}</strong></p>
              <p><span>Telephone</span><strong>{[settings.phone, settings.phoneAlt].filter(Boolean).join(' / ')}</strong></p>
              <p><span>Email</span><strong><a href={`mailto:${settings.email}`}>{settings.email}</a></strong></p>
            </div>
          </article>
          <div className="map-frame">
            <iframe title="Map of the club house" src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
