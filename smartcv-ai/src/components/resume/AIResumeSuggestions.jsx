import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const AIResumeSuggestions = ({ resume, onApplySuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');
  const cardClass =
    'rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]';
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';

  const getSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      // Format resume data to avoid circular references
      const formattedResume = {
        personalInfo: resume.personalInfo || {},
        summary: resume.summary || '',
        experience: (resume.experience || []).map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          duration: exp.duration || '',
          description: exp.description || ''
        })),
        education: (resume.education || []).map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          year: edu.year || ''
        })),
        skills: resume.skills || []
      };

      console.log('Sending request to analyze resume...', { 
        resume: formattedResume, 
        jobTitle: resume.jobTitle || 'Software Developer' 
      });

      const response = await axios.post(`${API_URL}/api/resumes/analyze`, {
        resume: formattedResume,
        jobTitle: resume.jobTitle || 'Software Developer'
      });

      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      
      // Handle specific error cases
      if (error.response?.status === 429) {
        setError('OpenAI API quota exceeded. Please check your API key and billing details.');
      } else if (error.response?.data?.error === 'OPENAI_ERROR') {
        setError('Error connecting to OpenAI API. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Error getting AI suggestions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (section, suggestion) => {
    onApplySuggestion(section, suggestion);
  };

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">AI assist</p>
          <h3 className="text-lg font-semibold text-stone-900">Suggestions & refinements</h3>
        </div>
        <button onClick={getSuggestions} disabled={loading} className={primaryButton}>
          {loading ? 'Analyzing…' : 'Get suggestions'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
          {error.includes('quota exceeded') && (
            <p className="mt-2 text-xs text-rose-600">
              Please verify billing on{' '}
              <a
                href="https://platform.openai.com/account/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rose-400"
              >
                OpenAI Dashboard
              </a>
              .
            </p>
          )}
        </div>
      )}

      {suggestions && (
        <div className="mt-6 space-y-6">
          {suggestions.summary && (
            <div className="rounded-2xl border border-stone-200/70 bg-white/90 p-4">
              <h4 className="text-sm font-semibold text-stone-900">Summary improvements</h4>
              <p className="mt-2 text-sm text-stone-600">{suggestions.summary}</p>
              <button
                onClick={() => handleApplySuggestion('summary', suggestions.summary)}
                className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
              >
                Apply suggestion
              </button>
            </div>
          )}

          {suggestions.experience && suggestions.experience.length > 0 && (
            <div className="rounded-2xl border border-stone-200/70 bg-white/90 p-4">
              <h4 className="text-sm font-semibold text-stone-900">Experience refinements</h4>
              <div className="mt-3 space-y-3">
                {suggestions.experience.map((suggestion, index) => (
                  <div key={index} className="rounded-2xl bg-stone-50/80 p-3">
                    <p className="text-sm text-stone-600">{suggestion}</p>
                    <button
                      onClick={() => handleApplySuggestion('experience', suggestion)}
                      className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                      Apply suggestion
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.skills && suggestions.skills.length > 0 && (
            <div className="rounded-2xl border border-stone-200/70 bg-white/90 p-4">
              <h4 className="text-sm font-semibold text-stone-900">Recommended skills</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleApplySuggestion('skills', suggestions.skills)}
                className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
              >
                Add all skills
              </button>
            </div>
          )}

          {suggestions.keywords && suggestions.keywords.length > 0 && (
            <div className="rounded-2xl border border-stone-200/70 bg-white/90 p-4">
              <h4 className="text-sm font-semibold text-stone-900">Industry keywords</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIResumeSuggestions; 