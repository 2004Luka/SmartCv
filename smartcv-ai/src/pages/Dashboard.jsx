import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import imageCompression from 'browser-image-compression';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const Dashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePicture || '');
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [profileMessage, setProfileMessage] = useState('');
  const panelClass =
    'rounded-[32px] border border-stone-200/70 bg-white/95 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)] backdrop-blur';
  const inputClass =
    'w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition';
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const secondaryButton =
    'inline-flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white/70 px-5 py-3 text-sm font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 disabled:cursor-not-allowed disabled:opacity-60';

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
      const res = await api.put(
        `/api/user/profile`,
        { name, profilePicture: profilePic }
      );
      updateProfile(res.data.user);
      setProfileMessage('Profile updated!');
    } catch (error) {
      setProfileMessage('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="relative isolate min-h-[90vh] py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute right-6 bottom-0 h-96 w-96 rounded-full bg-stone-200/35 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">Control center</p>
          <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl">Welcome back, {user?.name || 'creator'}</h1>
          <p className="text-sm text-stone-600 sm:text-base">Manage your profile details and account preferences.</p>
        </div>
        <div className="mt-10">
          <div className="mx-auto max-w-3xl">
            <div className={panelClass}>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <img
                    src={profilePicPreview || '/default-avatar.png'}
                    alt="Profile"
                    className="h-24 w-24 rounded-3xl border-2 border-white/80 object-cover shadow-xl ring-2 ring-emerald-100"
                  />
                  <label className="absolute bottom-0 right-0 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-500">
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 6.75h.008v.008H6.75V6.75zm10.5 10.5h.008v.008h-.008v-.008zM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" />
                    </svg>
                  </label>
                </div>
                <p className="text-sm font-medium text-stone-500">Tap the badge to refresh your portrait</p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Email</label>
                  <input
                    type="email"
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-stone-100 text-stone-500`}
                    placeholder="Your email"
                    defaultValue={user?.email}
                  />
                </div>
                <button className={primaryButton} onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                {profileMessage && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      profileMessage.includes('Failed')
                        ? 'border-rose-100 bg-rose-50 text-rose-700'
                        : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {profileMessage}
                  </div>
                )}
                <button onClick={logout} className={`${secondaryButton} w-full`}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;