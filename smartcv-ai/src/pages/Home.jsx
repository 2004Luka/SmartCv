import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ResumeForm from "../components/resume/ResumeForm";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-[rgb(var(--color-bg))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[rgb(var(--color-text))] tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block text-[rgb(var(--color-primary))]">SmartCv</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
            Create professional, tailored resumes with a clean, minimal workflow.
          </p>
          {user ? (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="text-sm sm:text-base font-medium text-slate-700">Welcome back, {user.firstName || user.email || 'User'}!</div>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary px-5 py-3"
                >
                  Create New Resume
                </button>
                <button
                  onClick={() => navigate('/resumes')}
                  className="btn-secondary px-5 py-3"
                >
                  My Resumes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 max-w-md mx-auto sm:flex sm:justify-center">
              <div className="">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center btn-primary px-6 py-3 text-base"
                >
                  Get Started
                </button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center btn-secondary px-6 py-3 text-base"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="card hover:shadow-md transition-shadow">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))]">
                    <svg className="h-6 w-6 text-[rgb(var(--color-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-base font-semibold text-[rgb(var(--color-text))] tracking-tight">AI-Powered Suggestions</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Get intelligent recommendations to improve your resume content and structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="card hover:shadow-md transition-shadow">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))]">
                    <svg className="h-6 w-6 text-[rgb(var(--color-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-base font-semibold text-[rgb(var(--color-text))] tracking-tight">Customizable Templates</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Choose from a variety of professional templates designed for different industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="card hover:shadow-md transition-shadow">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))]">
                    <svg className="h-6 w-6 text-[rgb(var(--color-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-base font-semibold text-[rgb(var(--color-text))] tracking-tight">Job-Specific Optimization</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Tailor your resume for specific job descriptions to increase your chances of success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <ResumeForm
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Home;