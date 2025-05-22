import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ResumeTemplate from './ResumeTemplate';

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
          withCredentials: true
        });
        setResume(response.data.data);
        setSelectedTemplate(response.data.data.template || 'professional');
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch resume');
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

  if (!resume) {
    return (
      <div className="text-center p-4">
        Resume not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Template Selector */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Select Template</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTemplate('professional')}
              className={`px-4 py-2 rounded ${
                selectedTemplate === 'professional'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setSelectedTemplate('creative')}
              className={`px-4 py-2 rounded ${
                selectedTemplate === 'creative'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Creative
            </button>
            <button
              onClick={() => setSelectedTemplate('executive')}
              className={`px-4 py-2 rounded ${
                selectedTemplate === 'executive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Executive
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-4xl mx-auto px-4">
        <ResumeTemplate resume={resume} template={selectedTemplate} />
      </div>
    </div>
  );
};

export default ResumeView; 