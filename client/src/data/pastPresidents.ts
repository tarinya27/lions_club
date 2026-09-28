export type PastTerm = {
  start: number;
  end: number;
  name: string;
  role?: string;
};

/**
 * One entry per presidential year. Names are kept exactly as supplied.
 * 1971–1972 is Elmo Jayasekera. An earlier note listed that year as 1071;
 * change this entry if the club confirms a different year.
 */
export const pastPresidents: PastTerm[] = [
  { start: 1966, end: 1967, name: 'T R Vivekananda' },
  { start: 1967, end: 1968, name: 'T R Vivekananda' },
  { start: 1968, end: 1969, name: 'J D D Priyadasa' },
  { start: 1969, end: 1970, name: 'Buddy Wethasinghe' },
  { start: 1970, end: 1971, name: 'Noel Aluwihare' },
  { start: 1971, end: 1972, name: 'Elmo Jayasekera' },
  { start: 1972, end: 1973, name: 'Vernon Boteju' },
  { start: 1973, end: 1974, name: 'Gabby Gomez' },
  { start: 1974, end: 1975, name: 'Frederick Medis' },
  { start: 1975, end: 1976, name: 'Lionel Abeywickrama' },
  { start: 1976, end: 1977, name: 'Rohith Caldera' },
  { start: 1977, end: 1978, name: 'Herbert Jayaweera' },
  { start: 1978, end: 1979, name: 'Asoka De Z Gunasekara' },
  { start: 1979, end: 1980, name: 'Titus Dharmaratne' },
  { start: 1980, end: 1981, name: 'Nihal Wickramasinghe' },
  { start: 1981, end: 1982, name: 'Daya Wakista' },
  { start: 1982, end: 1983, name: 'Cyril Salwudana' },
  { start: 1983, end: 1984, name: 'Gemunu Seneviratne' },
  { start: 1984, end: 1985, name: 'Nihal Malikaaaratchi' },
  { start: 1985, end: 1986, name: 'Dr. Neil Gunawardhana' },
  { start: 1986, end: 1987, name: 'Sam De Alwis' },
  { start: 1987, end: 1988, name: 'Gaminda Hagoda' },
  { start: 1988, end: 1989, name: 'Titus De Silva' },
  { start: 1989, end: 1990, name: 'Joy De Silva' },
  { start: 1990, end: 1991, name: 'Chandrananda Jayatilleka' },
  { start: 1991, end: 1992, name: 'Egerton Goonetilleke' },
  { start: 1992, end: 1993, name: 'Bertie Balasuriya' },
  { start: 1993, end: 1994, name: 'Chandrananda Jayatilleka' },
  { start: 1994, end: 1995, name: 'Piloo Lakdawalla' },
  { start: 1995, end: 1996, name: 'Alick Jayasekera' },
  { start: 1996, end: 1997, name: 'Asoka A De Gubasekera' },
  { start: 1997, end: 1998, name: 'Rohan Goonetilleke' },
  { start: 1998, end: 1999, name: 'Rohan Goonetilleke' },
  { start: 1999, end: 2000, name: 'Anura Dassanayake' },
  { start: 2000, end: 2001, name: 'Anura Dassanayake' },
  { start: 2001, end: 2002, name: 'Duksie Goonetilleke' },
  { start: 2002, end: 2003, name: 'Sasrath Nanayakkara' },
  { start: 2003, end: 2004, name: 'Duksie Goonetilleke' },
  { start: 2004, end: 2005, name: 'Duksie Goonetilleke' },
  { start: 2005, end: 2006, name: 'Prem Goonawardena' },
  { start: 2006, end: 2007, name: 'A G Wilmasiri' },
  { start: 2007, end: 2008, name: 'Deepal Gunaratne' },
  { start: 2008, end: 2009, name: 'Nirmali Abhayaratne' },
  { start: 2009, end: 2010, name: 'Asoka de Z Gunasekera' },
  { start: 2010, end: 2011, name: 'Jayantha Gunasekera' },
  { start: 2011, end: 2012, name: 'Jayantha Gunasekera' },
  { start: 2012, end: 2013, name: 'Jayantha Gunasekera' },
  { start: 2013, end: 2014, name: 'Vinnie Gunaratne' },
  { start: 2014, end: 2015, name: 'Vinnie Gunaratne' },
  { start: 2015, end: 2016, name: 'Chandrananda Jayatilleka' },
  { start: 2016, end: 2017, name: 'Jayantha Gunasekera' },
  { start: 2017, end: 2018, name: 'Lasitha Thianarachchi' },
  { start: 2018, end: 2019, name: 'Asoka De Z Gunasekera' },
  { start: 2019, end: 2020, name: 'Gamini Ratnayake' },
  { start: 2020, end: 2021, name: 'Sajitha De Mel' },
  { start: 2021, end: 2022, name: 'Rajantha Jayasinghe' },
  { start: 2022, end: 2023, name: 'Ganga Prasad Dissanayake' },
  { start: 2023, end: 2024, name: 'Geethika Wickramasinghe' },
  { start: 2024, end: 2025, name: 'Lasantha Perera' },
  { start: 2025, end: 2026, name: 'Upali De Silva', role: 'Immediate Past President' },
];

export type Era = {
  id: string;
  label: string;
  from: number;
  to: number;
};

export const presidentialEras: Era[] = [
  { id: '1966', label: '1966–1975', from: 1966, to: 1975 },
  { id: '1976', label: '1976–1985', from: 1976, to: 1985 },
  { id: '1986', label: '1986–1995', from: 1986, to: 1995 },
  { id: '1996', label: '1996–2005', from: 1996, to: 2005 },
  { id: '2006', label: '2006–2015', from: 2006, to: 2015 },
  { id: '2016', label: '2016–2026', from: 2016, to: 2026 },
];

export function termsInEra(era: Era) {
  return pastPresidents.filter((term) => term.start >= era.from && term.start <= era.to);
}

export function yearLabel(start: number, end: number) {
  return `${start} – ${end}`;
}
