import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResumeForm = ({ onClose, resume }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(resume || {
    title: '',
    jobTitle: '',
    summary: '',
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', field: '', graduationDate: '' }],
    skills: [''],
    template: 'professional'
  });

  const handleChange = (e, index, section) => {
    if (section) {
      const newData = [...formData[section]];
      newData[index] = { ...newData[index], [e.target.name]: e.target.value };
      setFormData({ ...formData, [section]: newData });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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

      const response = await axios.post('http://localhost:5000/api/resumes', formattedData, {
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Resume</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Basic Info', 'Experience', 'Education', 'Skills', 'Template'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step > index + 1
                        ? 'bg-primary-600 text-white'
                        : step === index + 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{label}</span>
                  {index < 4 && (
                    <div className="w-24 h-1 mx-4 bg-gray-200">
                      <div
                        className="h-full bg-primary-600"
                        style={{ width: step > index + 1 ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="form-label">Resume Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input-field"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="form-label">Target Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    className="input-field"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="summary" className="form-label">Professional Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows="4"
                    className="input-field"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeItem('experience', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="form-label">Company</label>
                        <input
                          type="text"
                          name="company"
                          className="input-field"
                          value={exp.company}
                          onChange={(e) => handleChange(e, index, 'experience')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Position</label>
                        <input
                          type="text"
                          name="position"
                          className="input-field"
                          value={exp.position}
                          onChange={(e) => handleChange(e, index, 'experience')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          className="input-field"
                          value={exp.startDate}
                          onChange={(e) => handleChange(e, index, 'experience')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          className="input-field"
                          value={exp.endDate}
                          onChange={(e) => handleChange(e, index, 'experience')}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="input-field"
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
                  className="btn-secondary w-full"
                >
                  Add Experience
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Education {index + 1}</h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeItem('education', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="form-label">School</label>
                        <input
                          type="text"
                          name="school"
                          className="input-field"
                          value={edu.school}
                          onChange={(e) => handleChange(e, index, 'education')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          className="input-field"
                          value={edu.degree}
                          onChange={(e) => handleChange(e, index, 'education')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Field of Study</label>
                        <input
                          type="text"
                          name="field"
                          className="input-field"
                          value={edu.field}
                          onChange={(e) => handleChange(e, index, 'education')}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Graduation Date</label>
                        <input
                          type="date"
                          name="graduationDate"
                          className="input-field"
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
                  className="btn-secondary w-full"
                >
                  Add Education
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="Enter a skill"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-secondary w-full"
                >
                  Add Skill
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {['professional', 'creative', 'executive'].map((template) => (
                    <div
                      key={template}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        formData.template === template ? 'border-primary-500 ring-2 ring-primary-500' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, template })}
                    >
                      <h3 className="text-lg font-medium capitalize">{template}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {template === 'professional' && 'Clean and professional design suitable for most industries.'}
                        {template === 'creative' && 'Modern and creative design for creative industries.'}
                        {template === 'executive' && 'Sophisticated design for executive positions.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn-primary ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary ml-auto"
                >
                  Create Resume
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm; 