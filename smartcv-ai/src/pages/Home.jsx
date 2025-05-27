import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ResumeForm from "../components/resume/ResumeForm";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-primary-600">SmartCv</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create professional, tailored resumes with the power of AI. Get personalized suggestions and optimize your CV for your dream job.
          </p>
          {user ? (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="text-lg font-semibold text-primary-700">Welcome back, {user.firstName || user.email || 'User'}!</div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-md bg-white text-primary-600 border border-primary-600 font-medium hover:bg-primary-50 transition-colors duration-200"
                >
                  Create New Resume
                </button>
                <button
                  onClick={() => navigate('/resumes')}
                  className="px-6 py-3 rounded-md bg-white text-primary-600 border border-primary-600 font-medium hover:bg-primary-50 transition-colors duration-200"
                >
                  My Resumes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI-Powered Suggestions</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Get intelligent recommendations to improve your resume content and structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Customizable Templates</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Choose from a variety of professional templates designed for different industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Job-Specific Optimization</h3>
                  <p className="mt-5 text-base text-gray-500">
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