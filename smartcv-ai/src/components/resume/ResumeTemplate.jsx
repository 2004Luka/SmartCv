import React from 'react';

const ResumeTemplate = ({ resume, template }) => {
  const renderProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{resume.jobTitle}</h1>
        <p className="text-gray-600">{resume.title}</p>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Professional Summary</h2>
        <p className="text-gray-600">{resume.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
              </p>
            </div>
            <p className="text-gray-600 mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-gray-500">{edu.field}</p>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(edu.graduationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreative = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header with accent color */}
      <div className="bg-blue-600 text-white p-8 -mx-8 -mt-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">{resume.jobTitle}</h1>
        <p className="text-xl opacity-90">{resume.title}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left column */}
        <div className="col-span-1">
          {/* Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Summary</h2>
            <p className="text-gray-600">{resume.summary}</p>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-2">
          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Experience</h2>
            {resume.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                  </p>
                </div>
                <p className="text-gray-600 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Education</h2>
            {resume.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-gray-500">{edu.field}</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(edu.graduationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutive = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header with border */}
      <div className="border-b-4 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{resume.jobTitle}</h1>
        <p className="text-xl text-gray-600">{resume.title}</p>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Executive Summary</h2>
        <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Professional Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
              </p>
            </div>
            <p className="text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-gray-500">{edu.field}</p>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(edu.graduationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Core Competencies</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  switch (template) {
    case 'creative':
      return renderCreative();
    case 'executive':
      return renderExecutive();
    default:
      return renderProfessional();
  }
};

export default ResumeTemplate; 