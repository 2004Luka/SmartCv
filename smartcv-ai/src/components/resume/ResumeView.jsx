import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ResumeTemplate from './ResumeTemplate';

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
        const response = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
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
      <div className="page-container">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center text-red-600 mb-4">{error}</div>
        <div className="text-center">
          <button 
            onClick={() => {
              setError('');
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
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

  return (
    <div className="page-container" style={{ background: '#f0f6fa', minHeight: '100vh' }}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleTemplateChange('professional')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedTemplate === 'professional'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => handleTemplateChange('creative')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedTemplate === 'creative'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => handleTemplateChange('executive')}
                className={`px-4 py-2 rounded-md transition-colors ${
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
              className="px-4 py-2 rounded-md transition-colors bg-primary-600 text-white hover:bg-primary-700"
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
              boxSizing: 'border-box'
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