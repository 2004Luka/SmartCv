import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ResumeTemplate from './ResumeTemplate';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const resumeRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        console.log('Fetching resume with ID:', id);
        const response = await axios.get(`${API_URL}/api/resumes/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        console.log('API Response:', response.data);
        
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
      setError('');
      if (!resumeRef.current) throw new Error('Resume element not found');

      // Save original width
      const originalWidth = resumeRef.current.style.width;
      // Set width to 794px for A4 at 96dpi
      resumeRef.current.style.width = '794px';

      // Wait for reflow
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: `resume_${resume.personalInfo?.firstName || 'export'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          windowHeight: 1123, // A4 height at 96dpi
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
      };

      await html2pdf().set(opt).from(element).save();

      // Restore original width
      resumeRef.current.style.width = originalWidth;
    } catch (err) {
      setError(`Failed to generate PDF: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your resume...</p>
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
              onClick={() => {
                setError('');
                window.location.reload();
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-gray-300">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Resume Preview</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleTemplateChange('professional')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedTemplate === 'professional'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => handleTemplateChange('creative')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedTemplate === 'creative'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => handleTemplateChange('executive')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedTemplate === 'executive'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Executive
              </button>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div 
            ref={resumeRef} 
            className="resume-container"
            style={{ 
              width: '210mm', 
              height: 'auto',
              minHeight: '297mm',
              margin: '0 auto', 
              background: 'white',
              position: 'relative',
              overflow: 'visible',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              boxSizing: 'border-box',
              borderRadius: '1rem'
            }}
          >
            <ResumeTemplate 
              resume={resume} 
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeView;