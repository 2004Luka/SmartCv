import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResumeForm from '../components/resume/ResumeForm';
import ResumeList from '../components/resume/ResumeList';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const Dashboard = () => {
  const { user, updateProfile, updateName,logout } = useAuth();
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
        `${process.env.VITE_API_URL?.replace(/"/g, '')}/api/user/profile`,
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
    <div className="min-h-[90vh] bg-[rgb(var(--color-bg))]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-[rgb(var(--color-border))]">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg))]'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-base transition-all duration-200`}
            >
              Settings
            </button>
           
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'settings' && (
            <div>
              <div className="card max-w-lg mx-auto">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={profilePicPreview || '/default-avatar.png'}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-[rgb(var(--color-border))]"
                    />
                    <label className="absolute bottom-0 right-0 bg-[rgb(var(--color-primary))] text-white rounded-full p-2 cursor-pointer hover:bg-[rgb(var(--color-primary-hover))] transition-all duration-200 shadow-sm">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 6.75h.008v.008H6.75V6.75zm10.5 10.5h.008v.008h-.008v-.008zM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" />
                      </svg>
                    </label>
                  </div>
                  <div className="text-slate-600 text-sm">Click the camera to change your profile picture</div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      disabled
                      className="input-field bg-slate-100 text-slate-500"
                      placeholder="Your email"
                      defaultValue={user?.email}
                    />
                  </div>
                  <button
                    className="form-submit"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {profileMessage && (
                    <div className={`text-sm mt-3 p-3 rounded-lg ${
                      profileMessage.includes('Failed') 
                        ? 'form-error-message' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                      {profileMessage}
                    </div>
                  )}
                  <button onClick={logout} className="btn-secondary text-sm px-3 py-2 w-full">Logout</button>

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

      
    </div>
  );
};

export default Dashboard;