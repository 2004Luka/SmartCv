import { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeList = ({ onEdit, onDelete }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resumes', {
          withCredentials: true
        });
        setResumes(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch resumes');
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No resumes found. Create your first resume!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <div
          key={resume._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">{resume.title}</h3>
          <p className="text-gray-600 mb-4">{resume.jobTitle}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {resume.skills.length > 3 && (
              <span className="text-gray-500 text-sm">+{resume.skills.length - 3} more</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {new Date(resume.updatedAt).toLocaleDateString()}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => onEdit(resume)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(resume._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeList; 