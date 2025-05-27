import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumeForm from '../components/resume/ResumeForm';
import ResumeList from '../components/resume/ResumeList';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {name || user?.email}
              </p>
            </div>
            <button
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
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
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
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
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
              <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={profilePicPreview || '/default-avatar.png'}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary-500 shadow"
                    />
                    <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
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
                  <div className="text-gray-600 text-sm">Click the camera to change your profile picture</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                      placeholder="Your email"
                      defaultValue={user?.email}
                    />
                  </div>
                  <button
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors w-full mt-4"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {profileMessage && <div className="text-xs text-green-600 mt-2">{profileMessage}</div>}
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