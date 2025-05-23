import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import ResumeTemplate from './ResumeTemplate';

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const resumeRef = useRef(null);
  const { toPDF, targetRef } = usePDF({ filename: 'resume.pdf' });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        console.log('Fetching resume with ID:', id);
        const response = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        console.log('API Response:', response.data);
        
        // Check if the response has the expected structure
        if (response.data && response.data.data) {
          setResume(response.data.data);
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Invalid resume data received');
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError(err.response?.data?.message || 'Failed to fetch resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  const handleExportPDF = async () => {
    try {
      await toPDF();
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="page-container">
        <div className="text-center">Resume not found</div>
      </div>
    );
  }

  console.log('Rendering resume with data:', resume);

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleTemplateChange('professional')}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === 'professional'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => handleTemplateChange('creative')}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === 'creative'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => handleTemplateChange('executive')}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === 'executive'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Executive
              </button>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8" ref={targetRef}>
          <ResumeTemplate resume={resume} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
};

export default ResumeView; 