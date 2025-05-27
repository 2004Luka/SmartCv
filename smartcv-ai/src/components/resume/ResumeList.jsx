import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from './ResumeForm';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Create New Resume
        </button>
      </div>

      {safeResumes.length === 0 ? (
        <div className="text-center text-gray-500">
          No resumes found. Create your first resume!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safeResumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{resume.title}</h2>
              <p className="text-gray-600 mb-4">{resume.jobTitle}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(resume._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(resume)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resume)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Resume</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setResumeToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeList; 