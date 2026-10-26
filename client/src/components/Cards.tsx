import { Link } from 'react-router-dom';
import { formatDate } from '../api';
import { NewsletterSummary, ProjectSummary, projectSection } from '../types';
import { Cover } from './ui';

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="project-card">
      <Link to={`/projects/${project.slug}`} className="cover">
        <Cover src={project.coverImage} label={project.title} />
      </Link>
      <div className="card-body">
        <p className="meta">
          <span>{formatDate(project.projectDate)}</span>
          {project.isSample ? <span className="chip-sample">Sample</span> : null}
        </p>
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
      </div>
    </article>
  );
}

export function LeadProject({ project }: { project: ProjectSummary }) {
  return (
    <article className="lead-project">
      <Link to={`/projects/${project.slug}`} className="cover">
        <Cover src={project.coverImage} label={project.title} />
      </Link>
      <div>
        <p className="kicker">{projectSection(project.category) === 'Upcoming' ? 'Upcoming project' : 'Past project'}</p>
        <p className="meta">
          <span>{formatDate(project.projectDate)}</span>
          {project.location ? <span>{project.location}</span> : null}
          {project.isSample ? <span className="chip-sample">Sample</span> : null}
        </p>
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <Link className="text-link" to={`/projects/${project.slug}`}>
          Read the report
        </Link>
      </div>
    </article>
  );
}

export function NewsletterRow({ item }: { item: NewsletterSummary }) {
  return (
    <article className="news-row">
      <div>
        <p className="meta">
          <span>{formatDate(item.issueDate)}</span>
          {item.isSample ? <span className="chip-sample">Sample</span> : null}
          {item.pdfUrl ? <span>PDF</span> : null}
        </p>
        <h3>
          <Link to={`/newsletters/${item.slug}`}>{item.title}</Link>
        </h3>
        <p>{item.summary}</p>
      </div>
      <Link className="text-link" to={`/newsletters/${item.slug}`}>
        Open
      </Link>
    </article>
  );
}
