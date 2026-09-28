const chapters = [
  {
    title: 'The clubhouse',
    text: 'Our present Clubhouse, located at No. 2, School Lane, Nawala Rajagiriya, is one of the oldest clubhouses owned by a Lions Club which has its own air-conditioned Auditorium, Board Room and activity center.',
  },
  {
    title: 'Service',
    text: 'Since its inauguration Lions of Nugegoda have done tremendous service to the needy people in Sri Lanka specially conducting medical camps, Multi Service projects, Building a village at Kosgoda for tsunami victims, supporting rural schools with necessary educational items, building houses for the needy people and sponsoring Scout Groups and Leo Clubs etc.',
  },
  {
    title: 'Leadership',
    text: 'The Lions Club of Nugegoda has a proud history of leadership and service. We have produced notable leaders, including Past International Director Lion Asoka De Z. Gunasekera, and two Past Council Chairpersons, Lion Vernon Botejue and Lion Lasantha Perera. Also Every District Governor in past has invited lions of Nugegoda for their key cabinet positions such as Cabinet Secretary, Treasurer, Region and Zone Chairpersons etc.',
  },
  {
    title: 'Nethsetha Eye Hospital',
    text: 'PID Asoka De Z. Gunasekera played a crucial role in establishing the Nethsetha Eye Hospital in Ratnapura, a landmark project of the Lions Club of Nugegoda, which continues to serve the community with distinction.',
  },
  {
    title: 'A role model club',
    text: 'Lions Club of Nugegoda is one of the Role model lions clubs to the nation that keeps up to the ethics and standards of the Lionism and has won many prestigious awards in district conventions.',
  },
];

export default function ClubHistory() {
  return (
    <section className="section history home-flow" aria-labelledby="club-history-title">
      <div className="wrap">
        <header className="history-head">
          <p className="kicker">Since 1966</p>
          <h2 id="club-history-title">Club History</h2>
        </header>
        <article className="history-founding">
          <p className="history-year">1966</p>
          <div>
            <p>
              The Lions Club of Nugegoda had its exploratory meeting on the 08th of August 1966 at Jambugasmulla, Nugegoda. Late Felix Perera envisaged organizing a Lions Club of Nugegoda and invited his neighbors in the area to assemble at the residence of late Elmo Jayasekera. Those present were Messrs. Gladstone Jacobs, S A T Selvam, J D D Piyadasa, Fredrick Medis, Alick Jayasekera, Vernon Boteju, Noel Aluvihare, T R Vivekananda and Elmo Jayasekera who were founding members.
            </p>
            <p>
              Our Club received its Charter on 07th November 1966 at the residence of President Elect, Mr T R Vivekananda of No 35, Jambugasmulla Road, Nugegoda.
            </p>
          </div>
        </article>
        <div className="history-grid">
          {chapters.map((chapter) => (
            <article key={chapter.title} className="history-card">
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
