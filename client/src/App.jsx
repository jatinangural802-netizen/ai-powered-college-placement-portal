import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import StudentDashboard from './pages/student/StudentDashboard';
import ProfilePage from './pages/student/ProfilePage';
import CompaniesPage from './pages/student/CompaniesPage';
import CompanyDetailPage from './pages/student/CompanyDetailPage';
import JobsPage from './pages/student/JobsPage';
import JobDetailPage from './pages/student/JobDetailPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import InterviewsPage from './pages/student/InterviewsPage';
import ResumeAnalyzerPage from './pages/student/ResumeAnalyzerPage';
import ResumeHistoryPage from './pages/student/ResumeHistoryPage';
import StudentAnalyticsPage from './pages/student/StudentAnalyticsPage';
import ResultsPage from './pages/student/ResultsPage';
import AnnouncementsPage from './pages/student/AnnouncementsPage';
import SettingsPage from './pages/student/SettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminInterviewsPage from './pages/admin/AdminInterviewsPage';
import AdminResultsPage from './pages/admin/AdminResultsPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminDrivesPage from './pages/admin/AdminDrivesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute roles={['STUDENT']} />}>
        <Route element={<DashboardLayout role="STUDENT" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/companies" element={<CompaniesPage />} />
          <Route path="/student/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/student/jobs" element={<JobsPage />} />
          <Route path="/student/jobs/:id" element={<JobDetailPage />} />
          <Route path="/student/applications" element={<ApplicationsPage />} />
          <Route path="/student/interviews" element={<InterviewsPage />} />
          <Route path="/student/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/student/resume-history" element={<ResumeHistoryPage />} />
          <Route path="/student/analytics" element={<StudentAnalyticsPage />} />
          <Route path="/student/results" element={<ResultsPage />} />
          <Route path="/student/announcements" element={<AnnouncementsPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<DashboardLayout role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/drives" element={<AdminDrivesPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
          <Route path="/admin/results" element={<AdminResultsPage />} />
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
