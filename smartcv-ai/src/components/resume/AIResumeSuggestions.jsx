import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AIResumeSuggestions = ({ resume, onApplySuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h3>
        <button
          onClick={getSuggestions}
          disabled={loading}
          className={`px-4 py-2 rounded-md ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Analyzing...' : 'Get Suggestions'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
          {error.includes('quota exceeded') && (
            <p className="mt-2 text-sm text-red-600">
              Please check your OpenAI API key and billing details at{' '}
              <a 
                href="https://platform.openai.com/account/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-red-800"
              >
                OpenAI Dashboard
              </a>
            </p>
          )}
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {/* Summary Suggestions */}
          {suggestions.summary && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary Improvements</h4>
              <p className="text-gray-600 mb-3">{suggestions.summary}</p>
              <button
                onClick={() => handleApplySuggestion('summary', suggestions.summary)}
                className="text-primary-600 hover:text-primary-700"
              >
                Apply Suggestion
              </button>
            </div>
          )}

          {/* Experience Suggestions */}
          {suggestions.experience && suggestions.experience.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Experience Improvements</h4>
              {suggestions.experience.map((suggestion, index) => (
                <div key={index} className="mb-3">
                  <p className="text-gray-600 mb-2">{suggestion}</p>
                  <button
                    onClick={() => handleApplySuggestion('experience', suggestion)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Apply Suggestion
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Skills Suggestions */}
          {suggestions.skills && suggestions.skills.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Recommended Skills</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestions.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleApplySuggestion('skills', suggestions.skills)}
                className="text-primary-600 hover:text-primary-700"
              >
                Add All Skills
              </button>
            </div>
          )}

          {/* Keywords Suggestions */}
          {suggestions.keywords && suggestions.keywords.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Industry Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
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