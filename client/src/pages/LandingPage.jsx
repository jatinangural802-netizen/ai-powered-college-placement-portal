import { Link } from 'react-router-dom';
import { ArrowRight, Brain, BarChart3, FileSearch, Users, Shield } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: FileSearch, title: 'ATS Resume Analyzer', desc: 'Get deterministic ATS scores, skill matching, and improvement suggestions.' },
  { icon: BriefcaseIcon, title: 'Smart Job Matching', desc: 'Find roles matched to your skills, department, and eligibility.' },
  { icon: BarChart3, title: 'Placement Analytics', desc: 'Track applications, interviews, and placement progress with charts.' },
  { icon: Users, title: 'Company Portal', desc: 'Browse companies, drives, and apply to eligible positions seamlessly.' },
  { icon: Shield, title: 'Admin Management', desc: 'Complete placement cell tools for drives, interviews, and results.' },
  { icon: Brain, title: 'AI Enhancement', desc: 'Optional AI-powered resume improvements when API is configured.' },
];

function BriefcaseIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <span className="font-bold text-xl text-slate-900">CareerBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Student Login</Link>
            <Link to="/login?role=admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">Admin Login</Link>
            <Link to="/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              AI-Powered College Placement & Career Portal
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Connect students, companies, and placement teams through one intelligent platform.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              CareerBridge combines placement management, ATS resume analysis, smart job matching,
              application tracking, and analytics — everything your placement cell needs.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register"><Button size="lg">Get Started <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link to="/login"><Button variant="secondary" size="lg">Student Login</Button></Link>
              <Link to="/login?role=admin"><Button variant="ghost" size="lg">Admin Login</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">A complete platform built for final-year placement management with professional-grade features.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {['Create Profile', 'Upload Resume', 'Analyze & Apply', 'Track Progress'].map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center mx-auto mb-4">{i + 1}</div>
                <h3 className="font-semibold text-slate-900">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-900 mb-2">CareerBridge</p>
          <p>AI-Powered College Placement & Career Portal</p>
          <p className="mt-4">© 2026 CareerBridge. Built for academic portfolio demonstration.</p>
        </div>
      </footer>
    </div>
  );
}
