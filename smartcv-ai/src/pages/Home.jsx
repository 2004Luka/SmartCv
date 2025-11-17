import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ResumeForm from "../components/resume/ResumeForm";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const secondaryButton =
    'inline-flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white/70 px-6 py-3 text-base font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400';
  const featureCard =
    'rounded-3xl border border-stone-200/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]';
  const featureIcon =
    'inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100';

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute right-10 bottom-0 h-72 w-72 rounded-full bg-lime-200/20 blur-[110px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-stone-200/70 bg-gradient-to-br from-white via-white/80 to-emerald-50/70 px-6 py-12 text-center shadow-[0_35px_90px_rgba(16,185,129,0.18)] sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">Smarter resumes</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-stone-900 sm:text-5xl">
            Build a confident, modern resume in minutes with{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              SmartCV
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 sm:text-lg">
            Guided flows, tasteful templates, and AI-steered copy make it effortless to deliver a recruiter-ready story
            across every application.
          </p>

          {user ? (
            <div className="mt-10 flex flex-col items-center gap-4">
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600/80">
                Welcome back, {user.firstName || user.email || 'pro'}!
              </span>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setShowForm(true)} className={primaryButton}>
                  Create new resume
                </button>
                <button onClick={() => navigate('/resumes')} className={secondaryButton}>
                  View my library
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('/register')} className={primaryButton}>
                Get started
              </button>
              <button onClick={() => navigate('/login')} className={secondaryButton}>
                Sign in
              </button>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className={featureCard}>
              <div className={featureIcon}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-stone-900">AI-powered clarity</h3>
              <p className="mt-2 text-sm text-stone-600">
                Intelligent prompts and phrasing ideas elevate each section so your experience reads crisp, focused, and
                impact-driven.
              </p>
            </div>

            <div className={featureCard}>
              <div className={featureIcon}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-stone-900">Tailored templates</h3>
              <p className="mt-2 text-sm text-stone-600">
                Choose from considered layouts inspired by top design systems, each optimized for clarity across ATS
                screens and PDFs.
              </p>
            </div>

            <div className={featureCard}>
              <div className={featureIcon}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-stone-900">Role-specific guidance</h3>
              <p className="mt-2 text-sm text-stone-600">
                Dial in each application with job-specific keywords, insight-backed structure, and a tone calibrated for
                the companies you target.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showForm && <ResumeForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Home;