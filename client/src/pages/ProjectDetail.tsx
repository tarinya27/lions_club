import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../api';
import { ProjectCard } from '../components/Cards';
import { RichText, useTitle } from '../components/ui';
import { Project, ProjectSummary } from '../types';

export default function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const [data, setData] = useState<{ project: Project; related: ProjectSummary[] } | null>(null);
  const [error, setError] = useState('');
  useTitle(data?.project.title || 'Project');

  useEffect(() => {
    setData(null);
    setError('');
    api<{ project: Project; related: ProjectSummary[] }>(`/api/projects/${slug}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <h1>Project not found</h1>
          <p>{error}</p>
          <Link className="text-link" to="/projects">Back to projects</Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return <section className="section"><div className="wrap"><p className="muted">Loading…</p></div></section>;
  }

  const { project, related } = data;

  return (
    <>
      <header className="page-hero">
        <div className="wrap narrow">
          <p className="kicker">{project.category}</p>
          <h1>{project.title}</h1>
          <p className="meta">
            <span>{formatDate(project.projectDate)}</span>
            {project.location ? <span>{project.location}</span> : null}
            {project.isSample ? <span className="chip-sample">Sample</span> : null}
            {project.status === 'draft' ? <span className="chip-sample">Draft</span> : null}
          </p>
        </div>
      </header>
      <section className="section">
        <div className="wrap narrow">
          {project.coverImage ? <img className="feature-photo" src={project.coverImage} alt="" /> : null}
          <p className="lede">{project.summary}</p>
          <RichText text={project.body} />
          {project.images.length > 0 ? (
            <div className="gallery">
              {project.images.map((image) => (
                <figure key={image.url}>
                  <img src={image.url} alt={image.caption || ''} />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}
          <Link className="text-link" to="/projects">All projects</Link>
        </div>
      </section>
      {related.length > 0 ? (
        <section className="section section-tight">
          <div className="wrap">
            <h2>More from the club</h2>
            <div className="project-grid">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
