import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ProjectsPage from './pages/Projects';
import ProjectDetailPage from './pages/ProjectDetail';
import NewslettersPage from './pages/Newsletters';
import NewsletterDetailPage from './pages/NewsletterDetail';
import ClubHousePage from './pages/ClubHouse';
import ContactPage from './pages/Contact';
import DonationsPage from './pages/Donations';
import NotFoundPage from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/Login';
import DashboardPage from './pages/admin/Dashboard';
import ProjectsAdminPage from './pages/admin/ProjectsAdmin';
import ProjectEditorPage from './pages/admin/ProjectEditor';
import NewslettersAdminPage from './pages/admin/NewslettersAdmin';
import NewsletterEditorPage from './pages/admin/NewsletterEditor';
import SlidesAdminPage from './pages/admin/SlidesAdmin';
import PagesAdminPage from './pages/admin/PagesAdmin';
import MessagesAdminPage from './pages/admin/MessagesAdmin';
import SettingsAdminPage from './pages/admin/SettingsAdmin';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="newsletters" element={<NewslettersPage />} />
        <Route path="newsletters/:slug" element={<NewsletterDetailPage />} />
        <Route path="club-house" element={<ClubHousePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin/login" element={<LoginPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsAdminPage />} />
        <Route path="projects/new" element={<ProjectEditorPage />} />
        <Route path="projects/:id" element={<ProjectEditorPage />} />
        <Route path="newsletters" element={<NewslettersAdminPage />} />
        <Route path="newsletters/new" element={<NewsletterEditorPage />} />
        <Route path="newsletters/:id" element={<NewsletterEditorPage />} />
        <Route path="slides" element={<SlidesAdminPage />} />
        <Route path="pages" element={<PagesAdminPage />} />
        <Route path="messages" element={<MessagesAdminPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
