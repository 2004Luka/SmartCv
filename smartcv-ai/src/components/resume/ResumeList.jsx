import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from './ResumeForm';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        navigate('/login');
        return;
      }

      console.log('Fetching resumes from:', `${API_URL}/api/resumes`);
      const response = await axios.get(`${API_URL}/api/resumes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Resumes response:', response.data);
      if (response.data && response.data.data) {
        setResumes(response.data.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/login');
        } else {
          setError(error.response.data.message || 'Failed to fetch resumes');
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up the request');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleEdit = (resume) => {
    setShowForm(true);
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
      await axios.delete(`${API_URL}/api/resumes/${resumeToDelete._id}`, {
        withCredentials: true
      });
      setResumes(resumes.filter(r => r._id !== resumeToDelete._id));
      setShowDeleteConfirm(false);
      setResumeToDelete(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume');
    }
  };

  const safeResumes = Array.isArray(resumes) ? resumes : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="form-error-message max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={fetchResumes}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto bg-[rgb(var(--color-bg))] px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-text))] mb-1">My Resumes</h1>
            <p className="text-sm sm:text-base text-slate-600">Manage and create your professional resumes</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-4 py-2"
          >
            Create New Resume
          </button>
        </div>

        {safeResumes.length === 0 ? (
          <div className="card text-center">
            <div className="text-6xl mb-6">📄</div>
            <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-3">No Resumes Yet</h2>
            <p className="text-slate-600 mb-6">
              Create your first professional resume to get started on your career journey.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary px-6 py-3"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeResumes.map((resume) => (
              <div
                key={resume._id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2 line-clamp-2">{resume.title}</h2>
                  <p className="text-slate-600 text-sm">{resume.jobTitle}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(resume._id)}
                    className="btn-primary px-3 py-1 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(resume)}
                    className="btn-secondary px-3 py-1 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resume)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
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
            onClose={() => {
              setShowForm(false);
              fetchResumes();
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border border-[rgb(var(--color-border))] w-full max-w-md mx-4 shadow-lg rounded-xl bg-[rgb(var(--color-surface))]">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4">Delete Resume</h3>
                <div className="mb-6 px-4">
                  <p className="text-slate-600">
                    Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setResumeToDelete(null);
                    }}
                    className="btn-secondary px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;