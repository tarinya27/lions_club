import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { ProjectCard } from '../components/Cards';
import { useTitle } from '../components/ui';
import { categories, ProjectSummary } from '../types';

export default function ProjectsPage() {
  useTitle('Projects');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ProjectSummary[]>('/api/projects').then(setProjects).catch((err) => setError(err.message));
  }, []);

  const years = useMemo(() => {
    const set = new Set((projects || []).map((project) => new Date(project.projectDate).getFullYear()));
    return [...set].filter((year) => !Number.isNaN(year)).sort((a, b) => b - a);
  }, [projects]);

  const year = params.get('year') || '';
  const visible = (projects || []).filter((project) => {
    if (category && project.category !== category) return false;
    if (year && String(new Date(project.projectDate).getFullYear()) !== year) return false;
    return true;
  });

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Updated every week</p>
          <h1>Projects</h1>
          <p>Service the club has taken on, written up by members and published as the work is done.</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap">
          <div className="filters">
            <button className={!category ? 'on' : ''} onClick={() => setFilter('category', '')}>All</button>
            {categories.map((item) => (
              <button key={item} className={category === item ? 'on' : ''} onClick={() => setFilter('category', item)}>
                {item}
              </button>
            ))}
            {years.length > 1 ? (
              <select value={year} onChange={(event) => setFilter('year', event.target.value)} aria-label="Filter by year">
                <option value="">All years</option>
                {years.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            ) : null}
          </div>
          {error ? <p className="muted">{error}</p> : null}
          {projects && visible.length === 0 ? <p className="muted">No projects in this view yet.</p> : null}
          <div className="project-grid">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
