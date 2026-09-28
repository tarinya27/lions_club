import PastLeaders from '../components/PastLeaders';
import { useSettings } from '../components/PublicLayout';
import { useTitle } from '../components/ui';
import { ClubPerson } from '../types';

function People({ people, empty }: { people: ClubPerson[]; empty: string }) {
  const listed = people.filter((person) => person.name.trim());
  if (listed.length === 0) return <p className="muted">{empty}</p>;
  return (
    <div className="people">
      {listed.map((person) => (
        <article key={`${person.name}-${person.detail}`} className="person">
          <strong>{person.name}</strong>
          {person.detail.trim() ? <span>{person.detail}</span> : null}
        </article>
      ))}
    </div>
  );
}

export default function AboutPage() {
  useTitle('About us');
  const settings = useSettings();

  return (
    <>
      <PastLeaders />
      <section className="section section-members" id="members">
        <div className="wrap">
          <h2>Meet our members</h2>
          <People people={settings.members ?? []} empty="Members will be published here." />
        </div>
      </section>
    </>
  );
}
