import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ResumeTemplate from './ResumeTemplate';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ResumeView = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const resumeRef = useRef(null);
  const viewportRef = useRef(null);
  const [fitToScreen, setFitToScreen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : true));
  const [scale, setScale] = useState(1);
  const [renderHeight, setRenderHeight] = useState(0);
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const pillButton = (active) =>
    `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-emerald-600 text-white shadow-[0_10px_30px_rgba(5,150,105,0.25)]'
        : 'border border-stone-200/80 bg-white/80 text-stone-600 hover:text-stone-900'
    }`;

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
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-500"></div>
          <p className="text-sm font-medium text-stone-600">Loading your resume…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-rose-50 px-6 py-5 text-center shadow-lg">
          <p className="text-base font-semibold text-rose-700">{error}</p>
          <button
            onClick={() => {
              setError('');
              window.location.reload();
            }}
            className={`${primaryButton} mt-4`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm font-medium text-stone-600">Resume not found.</p>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen py-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-16 h-96 w-96 rounded-full bg-emerald-200/20 blur-[140px]" />
        <div className="absolute right-6 bottom-0 h-96 w-96 rounded-full bg-stone-200/30 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[32px] border border-stone-200/70 bg-white/80 p-4 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-400">Preview</p>
            <h1 className="text-2xl font-semibold text-stone-900">Resume templates</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleTemplateChange('professional')} className={pillButton(selectedTemplate === 'professional')}>
                Professional
              </button>
              <button onClick={() => handleTemplateChange('creative')} className={pillButton(selectedTemplate === 'creative')}>
                Creative
              </button>
              <button onClick={() => handleTemplateChange('executive')} className={pillButton(selectedTemplate === 'executive')}>
                Executive
              </button>
            </div>
            <div className="flex gap-2 sm:hidden">
              <button onClick={() => setFitToScreen(true)} className={pillButton(fitToScreen)}>
                Fit to screen
              </button>
              <button onClick={() => setFitToScreen(false)} className={pillButton(!fitToScreen)}>
                Actual size
              </button>
            </div>
            <button onClick={handleExportPDF} className={primaryButton}>
              Export PDF
            </button>
          </div>
        </div>

        {fitToScreen ? (
          <div ref={viewportRef} className="w-full pt-6">
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
                    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.25)',
                    boxSizing: 'border-box',
                    borderRadius: '32px'
                  }}
                >
                  <ResumeTemplate resume={resume} template={selectedTemplate} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto pt-6">
            <div className="flex min-w-[210mm] justify-center">
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
                  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.25)',
                  boxSizing: 'border-box',
                  borderRadius: '32px'
                }}
              >
                <ResumeTemplate resume={resume} template={selectedTemplate} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeView;