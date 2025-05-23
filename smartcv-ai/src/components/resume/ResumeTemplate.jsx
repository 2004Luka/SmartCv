import React from 'react';

const ResumeTemplate = ({ resume, template }) => {
  // Validate resume data
  if (!resume) {
    return <div className="text-red-600">No resume data provided</div>;
  }

  // Ensure all required arrays exist
  const experience = Array.isArray(resume.experience) ? resume.experience : [];
  const education = Array.isArray(resume.education) ? resume.education : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];

  const formatDate = (date) => {
    if (!date) return 'Present';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const renderProfessional = () => (
    <div className="resume-template professional">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{resume.title || 'Untitled Resume'}</h1>
        <p className="text-xl text-gray-600">{resume.jobTitle || 'No Job Title'}</p>
      </header>

      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
          <p className="text-gray-700">{resume.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{exp.title || 'Untitled Position'}</h3>
              <p className="text-gray-600">{exp.company || 'No Company'}</p>
              <p className="text-sm text-gray-500">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{edu.degree || 'No Degree'}</h3>
              <p className="text-gray-600">{edu.institution || 'No Institution'}</p>
              <p className="text-sm text-gray-500">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill || 'Unnamed Skill'}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderCreative = () => (
    <div className="resume-template creative">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{resume.title || 'Untitled Resume'}</h1>
            <p className="text-xl text-gray-600">{resume.jobTitle || 'No Job Title'}</p>
          </header>

          {resume.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
              <p className="text-gray-700">{resume.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{exp.title || 'Untitled Position'}</h3>
                  <p className="text-gray-600">{exp.company || 'No Company'}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="col-span-1">
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Education</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree || 'No Degree'}</h3>
                  <p className="text-gray-600">{edu.institution || 'No Institution'}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill || 'Unnamed Skill'}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderExecutive = () => (
    <div className="resume-template executive border-2 border-gray-200 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{resume.title || 'Untitled Resume'}</h1>
        <p className="text-2xl text-gray-600">{resume.jobTitle || 'No Job Title'}</p>
      </header>

      {resume.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-lg">{resume.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-medium text-gray-900">{exp.title || 'Untitled Position'}</h3>
              <p className="text-lg text-gray-600">{exp.company || 'No Company'}</p>
              <p className="text-sm text-gray-500">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              {exp.description && <p className="text-gray-700 mt-2 text-lg">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-medium text-gray-900">{edu.degree || 'No Degree'}</h3>
                <p className="text-lg text-gray-600">{edu.institution || 'No Institution'}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-lg"
                >
                  {skill || 'Unnamed Skill'}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  try {
    switch (template) {
      case 'creative':
        return renderCreative();
      case 'executive':
        return renderExecutive();
      default:
        return renderProfessional();
    }
  } catch (error) {
    console.error('Error rendering resume template:', error);
    return (
      <div className="text-red-600 p-4">
        An error occurred while rendering the resume. Please try again.
      </div>
    );
  }
};

export default ResumeTemplate; 