import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumeForm from '../components/resume/ResumeForm';
import ResumeList from '../components/resume/ResumeList';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, updateProfile, updateName } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [profilePic, setProfilePic] = useState(user?.profilePicture || '');
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [profileMessage, setProfileMessage] = useState('');

  const handleEditResume = (resume) => {
    setSelectedResume(resume);
    setShowResumeForm(true);
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`${API_URL}/api/resumes/${resumeId}`, {
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

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress the image before reading as base64
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 300 });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileMessage('');
    try {
      const res = await axios.put(
        'http://localhost:5000/api/user/profile',
        { name, profilePicture: profilePic },
        { withCredentials: true }
      );
      updateProfile(res.data.user);
      setProfileMessage('Profile updated!');
    } catch (error) {
      setProfileMessage('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="mt-1 text-sm text-gray-300">
                Welcome back, {name || user?.email}
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold"
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
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-400 bg-gray-800/50'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-lg rounded-t-xl transition-all duration-300`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`${
                activeTab === 'resumes'
                  ? 'border-blue-500 text-blue-400 bg-gray-800/50'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-lg rounded-t-xl transition-all duration-300`}
            >
              My Resumes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Profile</h2>
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg mx-auto border border-gray-700">
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="relative">
                    <img
                      src={profilePicPreview || '/default-avatar.png'}
                      alt="Profile"
                      className="h-28 w-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 cursor-pointer hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg transform hover:scale-110">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 6.75h.008v.008H6.75V6.75zm10.5 10.5h.008v.008h-.008v-.008zM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" />
                      </svg>
                    </label>
                  </div>
                  <div className="text-gray-300 text-sm">Click the camera to change your profile picture</div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Email</label>
                    <input
                      type="email"
                      disabled
                      className="w-full rounded-xl border border-gray-600 bg-gray-600 text-gray-400 px-4 py-3 shadow-inner"
                      placeholder="Your email"
                      defaultValue={user?.email}
                    />
                  </div>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 w-full mt-6 font-semibold text-lg"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {profileMessage && (
                    <div className={`text-sm mt-3 p-3 rounded-xl ${
                      profileMessage.includes('Failed') 
                        ? 'text-red-400 bg-red-900/20 border border-red-700' 
                        : 'text-green-400 bg-green-900/20 border border-green-700'
                    }`}>
                      {profileMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resumes' && (
            <div>
              <ResumeList onEdit={handleEditResume} onDelete={handleDeleteResume} />
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