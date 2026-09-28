import { useTitle } from '../components/ui';

const facilities = [
  {
    name: 'Auditorium',
    points: [
      'Air-conditioned hall with a seating capacity of 60 in theater style',
      'Head table for 8',
      'Equipped with a podium, sound system, and multimedia facilities',
    ],
  },
  {
    name: 'Board Room',
    points: [
      'Non-air-conditioned boardroom with a seating capacity of 14',
      'Equipped with a boardroom table and whiteboard facilities',
    ],
  },
  {
    name: 'Rohith Caldera Hall',
    points: [
      'Non-air-conditioned hall with a seating capacity of 60 in theater style or 40 in cluster style',
      'Dining table with a separate pantry area',
      'Toilet facilities available',
    ],
  },
];

export default function ClubHousePage() {
  useTitle('Club house');

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Club house</p>
          <h1>Club House and Auditorium</h1>
          <p>Our club house is one of the pioneering club houses in Sri Lanka, offering the following facilities:</p>
        </div>
      </header>
      <section className="section section-causes">
        <div className="wrap">
          <div className="facility-grid">
            {facilities.map((facility) => (
              <article className="facility" key={facility.name}>
                <h3>{facility.name}</h3>
                <ul>
                  {facility.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
