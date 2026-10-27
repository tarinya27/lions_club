import PastLeaders from '../components/PastLeaders';
import { useSettings } from '../components/PublicLayout';
import { useTitle } from '../components/ui';
import { ClubPerson } from '../types';

function portraitLetters(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${parts[0][0]}${last}`.toUpperCase();
}

function People({ people, empty }: { people: ClubPerson[]; empty: string }) {
  const listed = people.filter((person) => person.name.trim());
  if (listed.length === 0) return <p className="muted">{empty}</p>;
  return (
    <div className="people">
      {listed.map((person) => (
        <article key={`${person.name}-${person.detail}`} className="person">
          <div className="person-photo">
            {person.photo ? (
              <img src={person.photo} alt="" />
            ) : (
              <span aria-hidden="true">{portraitLetters(person.name)}</span>
            )}
          </div>
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
  const people = (settings.members ?? []).filter((person) => person.name.trim());
  const officers = people.filter((person) => person.detail.trim());
  const members = people.filter((person) => !person.detail.trim());

  return (
    <>
      <PastLeaders />
      <section className="section section-members" id="members">
        <div className="wrap">
          <h2>Meet our members</h2>
          <p className="members-intro">The club’s current officers.</p>
          <People people={officers} empty="Members will be published here." />
          {members.length > 0 ? (
            <div className="members-more">
              <h3>Members</h3>
              <ul className="member-roll">
                {members.map((person) => (
                  <li key={person.name}>{person.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
