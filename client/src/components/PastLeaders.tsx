import { useState } from 'react';
import { pastPresidents, presidentialEras, termsInEra, yearLabel, PastTerm } from '../data/pastPresidents';

type Presidency = {
  name: string;
  terms: PastTerm[];
};

function groupByName(terms: PastTerm[]): Presidency[] {
  const groups: Presidency[] = [];
  terms.forEach((term) => {
    const existing = groups.find((group) => group.name === term.name);
    if (existing) {
      existing.terms.push(term);
      return;
    }
    groups.push({ name: term.name, terms: [term] });
  });
  return groups;
}

export function PresidentCard({ presidency, index }: { presidency: Presidency; index: number }) {
  const years = presidency.terms.map((term) => yearLabel(term.start, term.end));
  return (
    <article
      className="president"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <h3>{presidency.name}</h3>
      <p className="president-role">{presidency.terms.find((term) => term.role)?.role || 'Past President'}</p>
      <p className="president-years">
        {years.map((year) => <span key={year}>{year}</span>)}
      </p>
    </article>
  );
}

export default function PastLeaders() {
  const [eraId, setEraId] = useState(presidentialEras[0].id);
  const era = presidentialEras.find((item) => item.id === eraId) ?? presidentialEras[0];
  const presidencies = groupByName(termsInEra(era));

  return (
    <section className="section legacy" id="past-leaders" aria-labelledby="past-leaders-title">
      <div className="wrap">
        <header className="legacy-intro">
          <p className="kicker">Leadership legacy</p>
          <h1 id="past-leaders-title">Meet Our Past Leaders</h1>
          <p>Honouring the leaders who shaped our club’s journey throughout the years.</p>
          <div className="legacy-span">
            <span>1966</span>
            <span className="legacy-line">
              <span className="legacy-caption">Leadership Legacy</span>
            </span>
            <span>{pastPresidents[pastPresidents.length - 1].end}</span>
          </div>
        </header>
        <div className="filters legacy-eras" role="group" aria-label="Presidential eras">
          {presidentialEras.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === era.id ? 'on' : undefined}
              aria-pressed={item.id === era.id}
              onClick={() => setEraId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="legacy-grid" key={era.id} aria-live="polite">
          {presidencies.map((presidency, index) => (
            <PresidentCard key={presidency.name} presidency={presidency} index={index} />
          ))}
        </div>
        <p className="legacy-count">
          {pastPresidents.length} presidential years, from {pastPresidents[0].start} to {pastPresidents[pastPresidents.length - 1].end}.
        </p>
      </div>
    </section>
  );
}
