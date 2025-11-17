import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumes from '../../hooks/useResumes';
import ResumeForm from './ResumeForm';
import { useAuth } from '../../context/AuthContext';

const ResumeList = () => {
  const { resumes, loading, error, fetchResumes, deleteResume } = useResumes();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const secondaryButton =
    'inline-flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400';
  const inputClass =
    'w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition';
  const cardClass =
    'rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]';

  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleEdit = (resume) => {
    setShowForm(resume);
  };

  const handleView = (id) => {
    navigate(`/resumes/${id}`);
  };

  const handleDelete = (resume) => {
    setResumeToDelete(resume);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteResume(resumeToDelete._id);
      setShowDeleteConfirm(false);
      setResumeToDelete(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const safeResumes = Array.isArray(resumes) ? resumes : [];
  const filtered = safeResumes.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title?.toLowerCase().includes(q) ||
      r.jobTitle?.toLowerCase().includes(q)
    );
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'jobTitle') return (a.jobTitle || '').localeCompare(b.jobTitle || '');
    // default updatedAt desc
    const at = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bt = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bt - at;
  });

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-500"></div>
          <p className="text-sm font-medium text-stone-600">Loading your resumes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-rose-50 px-6 py-5 text-center shadow-lg">
          <p className="text-base font-semibold text-rose-700">{error}</p>
          <button onClick={fetchResumes} className={`${primaryButton} mt-4`}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-8 top-0 h-72 w-72 rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute right-0 bottom-12 h-80 w-80 rounded-full bg-stone-200/30 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">Library</p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-900">My resumes</h1>
            <p className="text-sm text-stone-600">Search, sort, and iterate on every version you’ve created.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              type="text"
              placeholder="Search resumes"
              className={inputClass}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className={`${inputClass} sm:w-40`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="updatedAt">Most recent</option>
              <option value="title">Title</option>
              <option value="jobTitle">Job title</option>
            </select>
            <button onClick={() => setShowForm(true)} className={primaryButton}>
              New resume
            </button>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-10 rounded-[32px] border border-stone-200/70 bg-white/90 p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
            <div className="text-5xl">📄</div>
            <h2 className="mt-4 text-2xl font-semibold text-stone-900">No resumes yet</h2>
            <p className="mt-2 text-sm text-stone-600">
              Start your first draft—each section is guided and fully editable.
            </p>
            <button onClick={() => setShowForm(true)} className={`${primaryButton} mt-6`}>
              Create your first resume
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((resume) => (
              <div key={resume._id} className={cardClass}>
                <div className="mb-4 space-y-1">
                  <h2 className="line-clamp-2 text-lg font-semibold text-stone-900">{resume.title}</h2>
                  <p className="text-sm font-medium text-stone-500">{resume.jobTitle}</p>
                  {resume.updatedAt && (
                    <p className="text-xs text-stone-400">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleView(resume._id)} className={primaryButton}>
                    View
                  </button>
                  <button onClick={() => handleEdit(resume)} className={secondaryButton}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resume)}
                    className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <ResumeForm
            resume={typeof showForm === 'object' ? showForm : null}
            onClose={() => {
              setShowForm(false);
              fetchResumes();
            }}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-white/95 p-6 text-center shadow-[0_35px_80px_rgba(15,23,42,0.2)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                ⚠️
              </div>
              <h3 className="mt-4 text-xl font-semibold text-stone-900">Delete resume?</h3>
              <p className="mt-2 text-sm text-stone-600">
                This action cannot be undone. “{resumeToDelete?.title || 'Untitled'}” will be permanently removed.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setResumeToDelete(null);
                  }}
                  className={`${secondaryButton} w-full`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;