import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumeForm from '../components/resume/ResumeForm';
import ResumeList from '../components/resume/ResumeList';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resumes');
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const handleEditResume = (resume) => {
    setSelectedResume(resume);
    setShowResumeForm(true);
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`http://localhost:5000/api/resumes/${resumeId}`, {
          withCredentials: true
        });
        // Refresh the resume list
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete resume:', error);
        alert('Failed to delete resume');
      }
    }
  };

  const handleResumeFormClose = () => {
    setShowResumeForm(false);
    setSelectedResume(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowResumeForm(true)}
            >
              Create New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('resumes')}
              className={`${
                activeTab === 'resumes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Resumes
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'resumes' && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">My Resumes</h2>
              <button
                onClick={() => setShowResumeForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create New Resume
              </button>
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resume Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Professional', 'Creative', 'Executive'].map((template) => (
                  <div
                    key={template}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">{template}</h3>
                    <p className="text-gray-600 mb-4">
                      A {template.toLowerCase()} template for your resume
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('resumes');
                        setShowResumeForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                      placeholder="Your email"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Form Modal */}
      {showResumeForm && (
        <ResumeForm
          onClose={handleResumeFormClose}
          resume={selectedResume}
        />
      )}
    </div>
  );
};

export default Dashboard; 