import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Briefcase, FileText, Calendar, BarChart3,
  User, Settings, LogOut, Menu, X, Bell, History, Megaphone, Award,
  Users, ClipboardList, Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/companies', label: 'Companies', icon: Building2 },
  { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/student/applications', label: 'Applications', icon: ClipboardList },
  { to: '/student/interviews', label: 'Interviews', icon: Calendar },
  { to: '/student/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { to: '/student/resume-history', label: 'Resume History', icon: History },
  { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/student/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/student/results', label: 'Results', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: User },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/companies', label: 'Companies', icon: Building2 },
  { to: '/admin/drives', label: 'Placement Drives', icon: Target },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { to: '/admin/interviews', label: 'Interviews', icon: Calendar },
  { to: '/admin/results', label: 'Results', icon: Award },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ role = 'STUDENT' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = role === 'ADMIN' ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <div>
            <Link to="/" className="font-bold text-slate-900">CareerBridge</Link>
            <p className="text-xs text-slate-500">{role === 'ADMIN' ? 'Admin Panel' : 'Student Portal'}</p>
          </div>
          <button className="ml-auto lg:hidden p-1" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon className="w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 lg:ml-0 ml-2">
              <p className="text-sm text-slate-500">Welcome back,</p>
              <p className="font-semibold text-slate-900">{user?.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-slate-100 relative" aria-label="Notifications">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">{user?.fullName?.[0]}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
