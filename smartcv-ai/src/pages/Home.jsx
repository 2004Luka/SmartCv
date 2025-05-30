import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ResumeForm from "../components/resume/ResumeForm";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SmartCv</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create professional, tailored resumes with the power of AI. Get personalized suggestions and optimize your CV for your dream job.
          </p>
          {user ? (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="text-lg font-semibold text-blue-400">Welcome back, {user.firstName || user.email || 'User'}!</div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Create New Resume
                </button>
                <button
                  onClick={() => navigate('/resumes')}
                  className="px-8 py-4 rounded-2xl bg-gray-700 text-white border border-gray-600 font-semibold text-lg hover:bg-gray-600 hover:border-gray-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  My Resumes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-2xl shadow-lg">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 md:py-5 md:text-xl md:px-12 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started
                </button>
              </div>
              <div className="mt-3 rounded-2xl shadow-lg sm:mt-0 sm:ml-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center px-10 py-4 border border-gray-600 text-lg font-semibold rounded-2xl text-white bg-gray-800 hover:bg-gray-700 hover:border-gray-500 md:py-5 md:text-xl md:px-12 transform hover:scale-105 transition-all duration-300 shadow-lg"
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
              <div className="flow-root bg-gray-800 rounded-2xl px-6 pb-8 border border-gray-700 hover:border-gray-600 transition-colors duration-300 shadow-xl hover:shadow-2xl">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-white tracking-tight">AI-Powered Suggestions</h3>
                  <p className="mt-5 text-base text-gray-300">
                    Get intelligent recommendations to improve your resume content and structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-2xl px-6 pb-8 border border-gray-700 hover:border-gray-600 transition-colors duration-300 shadow-xl hover:shadow-2xl">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-white tracking-tight">Customizable Templates</h3>
                  <p className="mt-5 text-base text-gray-300">
                    Choose from a variety of professional templates designed for different industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-2xl px-6 pb-8 border border-gray-700 hover:border-gray-600 transition-colors duration-300 shadow-xl hover:shadow-2xl">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-white tracking-tight">Job-Specific Optimization</h3>
                  <p className="mt-5 text-base text-gray-300">
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