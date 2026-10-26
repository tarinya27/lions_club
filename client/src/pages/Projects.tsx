import { useEffect, useState } from 'react';
import { api } from '../api';
import { ProjectCard } from '../components/Cards';
import { useTitle } from '../components/ui';
import { ProjectSummary, projectSection } from '../types';

export default function ProjectsPage() {
  useTitle('Projects');
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ProjectSummary[]>('/api/projects').then(setProjects).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!projects) return;
    const id = window.location.hash.replace('#', '');
    if (id === 'past' || id === 'upcoming') {
      document.getElementById(id)?.scrollIntoView();
    }
  }, [projects]);

  const upcoming = (projects || []).filter((project) => projectSection(project.category) === 'Upcoming');
  const past = (projects || []).filter((project) => projectSection(project.category) === 'Past');
  upcoming.sort((a, b) => a.projectDate.localeCompare(b.projectDate));
  past.sort((a, b) => b.projectDate.localeCompare(a.projectDate));

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="kicker">Projects</p>
          <h1>Projects</h1>
          <p>Past projects the club has completed, and upcoming projects still to come.</p>
        </div>
      </header>
      <section className="section">
        <div className="wrap">
          {error ? <p className="muted">{error}</p> : null}
          <div className="project-group" id="upcoming">
            <h2>Upcoming projects</h2>
            {projects && upcoming.length === 0 ? <p className="muted">Upcoming projects will be published here.</p> : null}
            <div className="project-grid">
              {upcoming.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
          <div className="project-group" id="past">
            <h2>Past projects</h2>
            {projects && past.length === 0 ? <p className="muted">Past projects will be published here.</p> : null}
            <div className="project-grid">
              {past.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
