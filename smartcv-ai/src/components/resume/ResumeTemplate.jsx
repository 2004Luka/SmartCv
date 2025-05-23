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
    <div className="resume-template professional" style={{
      width: '8.5in',
      minHeight: '11in',
      margin: '0 auto',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.4',
      color: '#333333',
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '35%',
        backgroundColor: '#4a5568',
        color: 'white',
        padding: '40pt 20pt'
      }}>
        {/* Profile Photo Placeholder */}
        <div style={{
          width: '120pt',
          height: '120pt',
          borderRadius: '50%',
          backgroundColor: '#718096',
          margin: '0 auto 30pt auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48pt',
          color: 'white'
        }}>
          👤
        </div>
  
        {/* Contact Section */}
        <section style={{ marginBottom: '30pt' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            margin: '0 0 15pt 0',
            textTransform: 'uppercase',
            letterSpacing: '1pt'
          }}>
            CONTACT
          </h2>
          <div style={{ fontSize: '9pt', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '8pt', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8pt' }}>📧</span>
              <span>{resume.email || 'hello@reallygreatsite.com'}</span>
            </div>
            <div style={{ marginBottom: '8pt', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8pt' }}>📱</span>
              <span>{resume.phone || '+123-456-7890'}</span>
            </div>
            <div style={{ marginBottom: '8pt', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8pt' }}>🌐</span>
              <span>{resume.website || 'www.reallygreatsite.com'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8pt' }}>📍</span>
              <span>{resume.location || '123 Anywhere St., Any City'}</span>
            </div>
          </div>
        </section>
  
        {/* Skills Section */}
        {skills.length > 0 && (
          <section style={{ marginBottom: '30pt' }}>
            <h2 style={{
              fontSize: '14pt',
              fontWeight: 'bold',
              margin: '0 0 15pt 0',
              textTransform: 'uppercase',
              letterSpacing: '1pt'
            }}>
              SKILLS
            </h2>
            <div style={{ fontSize: '9pt' }}>
              {skills.map((skill, index) => (
                <div key={index} style={{ 
                  marginBottom: '6pt',
                  paddingLeft: '8pt',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    top: '0'
                  }}>•</span>
                  {skill || 'Skill Name'}
                </div>
              ))}
            </div>
          </section>
        )}
  
        {/* Languages Section */}
        <section style={{ marginBottom: '30pt' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            margin: '0 0 15pt 0',
            textTransform: 'uppercase',
            letterSpacing: '1pt'
          }}>
            LANGUAGES
          </h2>
          <div style={{ fontSize: '9pt' }}>
            <div style={{ marginBottom: '6pt' }}>
              <div>English (Fluent)</div>
            </div>
            <div style={{ marginBottom: '6pt' }}>
              <div>French (Basic)</div>
            </div>
            <div style={{ marginBottom: '6pt' }}>
              <div>German (Basic)</div>
            </div>
            <div>
              <div>Spanish (Conversational)</div>
            </div>
          </div>
        </section>
  
        {/* References Section */}
        <section>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            margin: '0 0 15pt 0',
            textTransform: 'uppercase',
            letterSpacing: '1pt'
          }}>
            REFERENCE
          </h2>
          <div style={{ fontSize: '9pt', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '12pt' }}>
              <div style={{ fontWeight: 'bold' }}>Estelle Darcy</div>
              <div>Wardiere Inc. / CEO</div>
              <div>Phone: 123-456-7890</div>
              <div>Email: hello@reallygreatsite.com</div>
            </div>
          </div>
        </section>
      </div>
  
      {/* Right Main Content */}
      <div style={{
        width: '65%',
        padding: '40pt 30pt',
        backgroundColor: 'white'
      }}>
        {/* Header */}
        <header style={{ marginBottom: '30pt' }}>
          <h1 style={{
            fontSize: '28pt',
            fontWeight: 'bold',
            margin: '0',
            color: '#4a5568',
            textTransform: 'uppercase',
            letterSpacing: '2pt'
          }}>
            {resume.title || 'RICHARD SANCHEZ'}
          </h1>
          <p style={{
            fontSize: '12pt',
            margin: '5pt 0 0 0',
            color: '#718096',
            textTransform: 'uppercase',
            letterSpacing: '1pt'
          }}>
            {resume.jobTitle || 'MARKETING MANAGER'}
          </p>
        </header>
  
        {/* Profile Section */}
        {resume.summary && (
          <section style={{ marginBottom: '25pt' }}>
            <h2 style={{
              fontSize: '12pt',
              fontWeight: 'bold',
              margin: '0 0 10pt 0',
              color: '#4a5568',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                marginRight: '8pt', 
                fontSize: '14pt',
                color: '#4a5568'
              }}>👤</span>
              PROFILE
            </h2>
            <div style={{
              borderLeft: '3pt solid #e2e8f0',
              paddingLeft: '15pt',
              fontSize: '10pt',
              lineHeight: '1.5',
              textAlign: 'justify'
            }}>
              {resume.summary}
            </div>
          </section>
        )}
  
        {/* Work Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: '25pt' }}>
            <h2 style={{
              fontSize: '12pt',
              fontWeight: 'bold',
              margin: '0 0 15pt 0',
              color: '#4a5568',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                marginRight: '8pt', 
                fontSize: '14pt',
                color: '#4a5568'
              }}>💼</span>
              WORK EXPERIENCE
            </h2>
            
            {experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '20pt',
                borderLeft: '3pt solid #e2e8f0',
                paddingLeft: '15pt'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '5pt'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 'bold',
                      margin: '0',
                      color: '#4a5568'
                    }}>
                      {exp.company || 'Company Name'}
                    </h3>
                    <p style={{
                      fontSize: '10pt',
                      margin: '2pt 0 0 0',
                      color: '#718096',
                      fontStyle: 'italic'
                    }}>
                      {exp.title || 'Job Title'} & Specialist
                    </p>
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: '#718096',
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </div>
                </div>
                
                {exp.description && (
                  <div style={{
                    fontSize: '9pt',
                    lineHeight: '1.5',
                    color: '#4a5568',
                    marginTop: '8pt'
                  }}>
                    <ul style={{ margin: '0', paddingLeft: '15pt' }}>
                      <li style={{ marginBottom: '3pt' }}>
                        {exp.description}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
  
        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '12pt',
              fontWeight: 'bold',
              margin: '0 0 15pt 0',
              color: '#4a5568',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                marginRight: '8pt', 
                fontSize: '14pt',
                color: '#4a5568'
              }}>🎓</span>
              EDUCATION
            </h2>
            
            {education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '15pt',
                borderLeft: '3pt solid #e2e8f0',
                paddingLeft: '15pt'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '11pt',
                      fontWeight: 'bold',
                      margin: '0',
                      color: '#4a5568'
                    }}>
                      {edu.degree || 'Degree Name'}
                    </h3>
                    <p style={{
                      fontSize: '10pt',
                      margin: '2pt 0 0 0',
                      color: '#718096'
                    }}>
                      {edu.institution || 'Institution Name'}
                    </p>
                    <p style={{
                      fontSize: '9pt',
                      margin: '2pt 0 0 0',
                      color: '#718096'
                    }}>
                      GPA: 3.8 / 4.0
                    </p>
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: '#718096',
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
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