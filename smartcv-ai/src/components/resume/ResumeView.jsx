import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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
  const viewportRef = useRef(null);
  const [fitToScreen, setFitToScreen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : true));
  const [scale, setScale] = useState(1);
  const [renderHeight, setRenderHeight] = useState(0);

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

  useEffect(() => {
    const computeScale = () => {
      if (!fitToScreen) {
        setScale(1);
        if (resumeRef.current) setRenderHeight(resumeRef.current.offsetHeight);
        return;
      }
      const baseWidthPx = 794; // 210mm at ~96dpi
      const available = viewportRef.current?.clientWidth || window.innerWidth;
      const paddingAllowance = 32; // approximate horizontal padding
      const newScale = Math.min(1, (available - paddingAllowance) / baseWidthPx);
      setScale(newScale > 0 ? newScale : 1);
      if (resumeRef.current) setRenderHeight(resumeRef.current.offsetHeight * (newScale > 0 ? newScale : 1));
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [fitToScreen, resumeRef]);

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  const handleExportPDF = async () => {
    try {
      setError('');
      if (!resumeRef.current) throw new Error('Resume element not found');

      // Capture the on-screen element for reliability
      const prevFit = fitToScreen;
      const element = resumeRef.current;
      setFitToScreen(false);
      await new Promise(resolve => setTimeout(resolve, 120));

      // Wait for layout and fonts
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      // Force A4 px dimensions
      const originalWidth = element.style.width;
      const originalMinHeight = element.style.minHeight;
      element.style.width = '794px';
      element.style.minHeight = '1123px';
      element.style.webkitPrintColorAdjust = 'exact';
      element.style.printColorAdjust = 'exact';
      await new Promise(resolve => setTimeout(resolve, 80));

      const widthPx = element.offsetWidth || 794;
      const heightPx = element.offsetHeight || 1123;
      const opt = {
        margin: 0,
        filename: `resume_${resume.personalInfo?.firstName || 'export'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: widthPx,
          windowHeight: heightPx,
        },
        jsPDF: { unit: 'px', format: [widthPx, heightPx], orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();

      // Restore
      element.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      setFitToScreen(prevFit);
    } catch (err) {
      setError(`Failed to generate PDF: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading your resume...</p>
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
              onClick={() => {
                setError('');
                window.location.reload();
              }}
              className="mt-4 btn-primary"
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
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="text-center text-slate-600">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-[rgb(var(--color-text))]">Resume Preview</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleTemplateChange('professional')}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedTemplate === 'professional'
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-surface))] text-slate-600 border border-[rgb(var(--color-border))] hover:bg-slate-50'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => handleTemplateChange('creative')}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedTemplate === 'creative'
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-surface))] text-slate-600 border border-[rgb(var(--color-border))] hover:bg-slate-50'
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => handleTemplateChange('executive')}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  selectedTemplate === 'executive'
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-surface))] text-slate-600 border border-[rgb(var(--color-border))] hover:bg-slate-50'
                }`}
              >
                Executive
              </button>
            </div>
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => setFitToScreen(true)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  fitToScreen
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-surface))] text-slate-600 border border-[rgb(var(--color-border))] hover:bg-slate-50'
                }`}
              >
                Fit to screen
              </button>
              <button
                onClick={() => setFitToScreen(false)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  !fitToScreen
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-surface))] text-slate-600 border border-[rgb(var(--color-border))] hover:bg-slate-50'
                }`}
              >
                Actual size
              </button>
            </div>
            <button
              onClick={handleExportPDF}
              className="btn-primary px-4 py-2"
            >
              Export PDF
            </button>
          </div>
        </div>

        {fitToScreen ? (
          <div ref={viewportRef} className="w-full">
            <div className="flex justify-center" style={{ height: renderHeight }}>
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
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
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="flex justify-center min-w-[210mm]">
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
        )}
      </div>
    </div>
  );
};

export default ResumeView;