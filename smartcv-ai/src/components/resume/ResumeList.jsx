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

  // Defensive: ensure resumes is always an array
  const safeResumes = Array.isArray(resumes) ? resumes : [];

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-lg font-medium text-red-400">{error}</p>
            <button
              onClick={fetchResumes}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">My Resumes</h1>
            <p className="text-lg text-gray-300">Manage and create your professional resumes</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold"
          >
            Create New Resume
          </button>
        </div>

        {safeResumes.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-6">📄</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Resumes Yet</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Create your first professional resume to get started on your career journey.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold text-lg"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {safeResumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-1"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{resume.title}</h2>
                  <p className="text-gray-300 text-sm">{resume.jobTitle}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(resume._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors duration-300 font-medium text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(resume)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors duration-300 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resume)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors duration-300 font-medium text-sm"
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border border-gray-700 w-96 shadow-2xl rounded-2xl bg-gray-800 max-w-md">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-4">Delete Resume</h3>
                <div className="mb-6 px-4">
                  <p className="text-gray-300">
                    Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setResumeToDelete(null);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors duration-300 font-medium"
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