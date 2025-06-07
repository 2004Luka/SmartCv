import { useState } from 'react';
import axios from 'axios';
//import AIResumeSuggestions from './AIResumeSuggestions';

const ResumeForm = ({ onClose, resume }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(resume || {
    title: '',
    jobTitle: '',
    summary: '',
    contact: {
      email: '',
      phone: '',
      website: '',
      location: ''
    },
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', field: '', graduationDate: '', gpa: '' }],
    skills: [''],
    languages: [{ name: '', proficiency: 'Basic' }],
    references: [{ name: '', position: '', company: '', phone: '', email: '' }],
    template: 'professional'
  });

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const newData = [...formData[section]];
      newData[index] = { ...newData[index], [name]: value };
      setFormData({ ...formData, [section]: newData });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = (section) => {
    const emptyItem = section === 'experience' 
      ? { company: '', position: '', startDate: '', endDate: '', description: '' }
      : { school: '', degree: '', field: '', graduationDate: '' };
    setFormData({ ...formData, [section]: [...formData[section], emptyItem] });
  };

  const removeItem = (section, index) => {
    const newData = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: newData });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] });
  };

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format dates before sending
      const formattedData = {
        ...formData,
        experience: formData.experience.map(exp => ({
          ...exp,
          startDate: formatDate(exp.startDate),
          endDate: formatDate(exp.endDate)
        })),
        education: formData.education.map(edu => ({
          ...edu,
          graduationDate: formatDate(edu.graduationDate)
        }))
      };

      // Remove empty skills
      formattedData.skills = formattedData.skills.filter(skill => skill.trim() !== '');

      const response = await axios.post(`${process.env.VITE_API_URL?.replace(/"/g, '')}/api/resumes`, formattedData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onClose();
        window.location.reload(); // Refresh to show the new resume
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        alert(error.response.data.error || 'Failed to create resume');
      } else {
        alert('Failed to create resume');
      }
    }
  };

  const handleApplySuggestion = (section, suggestion) => {
    if (section === 'summary') {
      setFormData(prev => ({
        ...prev,
        summary: suggestion
      }));
    } else if (section === 'experience') {
      // Find the most relevant experience entry to update
      const updatedExperience = [...formData.experience];
      updatedExperience[0] = {
        ...updatedExperience[0],
        description: suggestion
      };
      setFormData(prev => ({
        ...prev,
        experience: updatedExperience
      }));
    } else if (section === 'skills') {
      // Add new skills while avoiding duplicates
      const currentSkills = new Set(formData.skills);
      suggestion.forEach(skill => currentSkills.add(skill));
      setFormData(prev => ({
        ...prev,
        skills: Array.from(currentSkills)
      }));
    }
  };

  const addLanguage = () => {
    setFormData({ ...formData, languages: [...formData.languages, { name: '', proficiency: 'Basic' }] });
  };

  const removeLanguage = (index) => {
    const newLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: newLanguages });
  };

  const addReference = () => {
    setFormData({ ...formData, references: [...formData.references, { name: '', position: '', company: '', phone: '', email: '' }] });
  };

  const removeReference = (index) => {
    const newReferences = formData.references.filter((_, i) => i !== index);
    setFormData({ ...formData, references: newReferences });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Resume</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Basic Info', 'Experience', 'Education', 'Skills'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step > index + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : step === index + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-300">{label}</span>
                  {index < 3 && (
                    <div className="w-24 h-1 mx-4 bg-gray-700">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        style={{ width: step > index + 1 ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Resume Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">Target Job Title</label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                      <textarea
                        id="summary"
                        name="summary"
                        rows="4"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="contact.email"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.contact.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="contact.phone"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.contact.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                          <input
                            type="url"
                            id="website"
                            name="contact.website"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.contact.website}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                          <input
                            type="text"
                            id="location"
                            name="contact.location"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.contact.location}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-white">Experience {index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeItem('experience', index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                            <input
                              type="text"
                              name="company"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={exp.company}
                              onChange={(e) => handleChange(e, index, 'experience')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                            <input
                              type="text"
                              name="position"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={exp.position}
                              onChange={(e) => handleChange(e, index, 'experience')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                            <input
                              type="date"
                              name="startDate"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={exp.startDate}
                              onChange={(e) => handleChange(e, index, 'experience')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                            <input
                              type="date"
                              name="endDate"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={exp.endDate}
                              onChange={(e) => handleChange(e, index, 'experience')}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                          <textarea
                            name="description"
                            rows="3"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={exp.description}
                            onChange={(e) => handleChange(e, index, 'experience')}
                            required
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addItem('experience')}
                      className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
                    >
                      Add Experience
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-white">Education {index + 1}</h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeItem('education', index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">School</label>
                            <input
                              type="text"
                              name="school"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={edu.school}
                              onChange={(e) => handleChange(e, index, 'education')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
                            <input
                              type="text"
                              name="degree"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={edu.degree}
                              onChange={(e) => handleChange(e, index, 'education')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Field of Study</label>
                            <input
                              type="text"
                              name="field"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={edu.field}
                              onChange={(e) => handleChange(e, index, 'education')}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Date</label>
                            <input
                              type="date"
                              name="graduationDate"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={edu.graduationDate}
                              onChange={(e) => handleChange(e, index, 'education')}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addItem('education')}
                      className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
                    >
                      Add Education
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSkill}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Add Skill
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
                      {formData.languages.map((language, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Language"
                            value={language.name}
                            onChange={(e) => {
                              const newLanguages = [...formData.languages];
                              newLanguages[index].name = e.target.value;
                              setFormData({ ...formData, languages: newLanguages });
                            }}
                            required
                          />
                          <select
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={language.proficiency}
                            onChange={(e) => {
                              const newLanguages = [...formData.languages];
                              newLanguages[index].proficiency = e.target.value;
                              setFormData({ ...formData, languages: newLanguages });
                            }}
                            required
                          >
                            <option value="Basic">Basic</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native">Native</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Add Language
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">References</h3>
                      {formData.references.map((reference, index) => (
                        <div key={index} className="space-y-4 mb-4 p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={reference.name}
                              onChange={(e) => {
                                const newReferences = [...formData.references];
                                newReferences[index].name = e.target.value;
                                setFormData({ ...formData, references: newReferences });
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={reference.position}
                              onChange={(e) => {
                                const newReferences = [...formData.references];
                                newReferences[index].position = e.target.value;
                                setFormData({ ...formData, references: newReferences });
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={reference.company}
                              onChange={(e) => {
                                const newReferences = [...formData.references];
                                newReferences[index].company = e.target.value;
                                setFormData({ ...formData, references: newReferences });
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                            <input
                              type="tel"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={reference.phone}
                              onChange={(e) => {
                                const newReferences = [...formData.references];
                                newReferences[index].phone = e.target.value;
                                setFormData({ ...formData, references: newReferences });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                              type="email"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={reference.email}
                              onChange={(e) => {
                                const newReferences = [...formData.references];
                                newReferences[index].email = e.target.value;
                                setFormData({ ...formData, references: newReferences });
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-300"
                          >
                            Remove Reference
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addReference}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Add Reference
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
                    >
                      Previous
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium ml-auto"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium ml-auto"
                    >
                      Create Resume
                    </button>
                  )}
                </div>
              </form>
            </div>
            {/* <div>
              <AIResumeSuggestions
                resume={formData}
                onApplySuggestion={handleApplySuggestion}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm; 