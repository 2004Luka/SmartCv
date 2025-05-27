import React from 'react';

const ResumeTemplate = ({ resume, template, isPdf = false }) => {
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
      width: '210mm',
      minHeight: '297mm',
      height: '297mm',
      margin: 0,
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.4',
      color: '#333333',
      display: 'flex',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '35%',
        backgroundColor: '#4a5568',
        color: 'white',
        padding: '40pt 20pt',
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Profile Photo Placeholder - simplified for PDF */}
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
          color: 'white',
          position: 'relative'
        }}>
          {resume.title ? resume.title.charAt(0).toUpperCase() : '?'}
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
            {resume.contact?.email && (
              <div style={{ marginBottom: '8pt' }}>
                <span>Email: {resume.contact.email}</span>
              </div>
            )}
            {resume.contact?.phone && (
              <div style={{ marginBottom: '8pt' }}>
                <span>Phone: {resume.contact.phone}</span>
              </div>
            )}
            {resume.contact?.website && (
              <div style={{ marginBottom: '8pt' }}>
                <span>Website: {resume.contact.website}</span>
              </div>
            )}
            {resume.contact?.location && (
              <div>
                <span>Location: {resume.contact.location}</span>
              </div>
            )}
          </div>
        </section>
  
        {/* Skills Section */}
        {resume.skills && resume.skills.length > 0 && (
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
              {resume.skills.map((skill, index) => (
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
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}
  
        {/* Languages Section */}
        {resume.languages && resume.languages.length > 0 && (
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
              {resume.languages.map((language, index) => (
                <div key={index} style={{ marginBottom: '6pt' }}>
                  <div>{language.name} ({language.proficiency})</div>
                </div>
              ))}
            </div>
          </section>
        )}
  
        {/* References Section */}
        {resume.references && resume.references.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '14pt',
              fontWeight: 'bold',
              margin: '0 0 15pt 0',
              textTransform: 'uppercase',
              letterSpacing: '1pt'
            }}>
              REFERENCES
            </h2>
            <div style={{ fontSize: '9pt', lineHeight: '1.5' }}>
              {resume.references.map((reference, index) => (
                <div key={index} style={{ marginBottom: '12pt' }}>
                  <div style={{ fontWeight: 'bold' }}>{reference.name}</div>
                  <div>{reference.position} / {reference.company}</div>
                  {reference.phone && <div>Phone: {reference.phone}</div>}
                  {reference.email && <div>Email: {reference.email}</div>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
  
      {/* Right Main Content */}
      <div style={{
        width: '65%',
        padding: '40pt 30pt',
        backgroundColor: 'white',
        height: '100%',
        boxSizing: 'border-box'
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
            {resume.title}
          </h1>
          <p style={{
            fontSize: '12pt',
            margin: '5pt 0 0 0',
            color: '#718096',
            textTransform: 'uppercase',
            letterSpacing: '1pt'
          }}>
            {resume.jobTitle}
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
              textTransform: 'uppercase'
            }}>
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
  
        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: '25pt' }}>
            <h2 style={{
              fontSize: '12pt',
              fontWeight: 'bold',
              margin: '0 0 15pt 0',
              color: '#4a5568',
              textTransform: 'uppercase'
            }}>
              EXPERIENCE
            </h2>
            
            {experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '15pt',
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
                      {exp.company}
                    </h3>
                    <p style={{
                      fontSize: '10pt',
                      margin: '2pt 0 0 0',
                      color: '#718096',
                      fontStyle: 'italic'
                    }}>
                      {exp.title}
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
              textTransform: 'uppercase'
            }}>
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
                      {edu.degree}
                    </h3>
                    <p style={{
                      fontSize: '10pt',
                      margin: '2pt 0 0 0',
                      color: '#718096'
                    }}>
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p style={{
                        fontSize: '9pt',
                        margin: '2pt 0 0 0',
                        color: '#718096'
                      }}>
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  <div style={{
                    fontSize: '9pt',
                    color: '#718096',
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(edu.graduationDate)}
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
    <div 
      className={isPdf ? "" : "resume-template creative bg-white min-h-screen relative overflow-hidden"}
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        height: '297mm', 
        margin: 0, 
        boxSizing: 'border-box',
        backgroundColor: 'white',
        position: 'relative',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Decorative elements - only when not PDF */}
      {!isPdf && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '128px',
            height: '128px',
            backgroundColor: '#3b82f6',
            opacity: 0.1,
            transform: 'rotate(45deg)'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '40px',
            width: '64px',
            height: '64px',
            border: '4px solid #a5b4fc',
            opacity: 0.2,
            transform: 'rotate(12deg)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '40px',
            width: '96px',
            height: '4px',
            backgroundColor: '#f472b6'
          }}></div>
        </>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        padding: '32px',
        position: 'relative',
        zIndex: 10,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        <div>
          <header style={{ marginBottom: '24px', position: 'relative' }}>
            {/* Simple accent bar - only when not PDF */}
            {!isPdf && (
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: 0,
                width: '8px',
                height: '80px',
                backgroundColor: '#4f46e5',
                borderRadius: '9999px'
              }}></div>
            )}
            
            <h1 style={{
              fontSize: isPdf ? '24pt' : '36px',
              fontWeight: '900',
              letterSpacing: '-0.025em',
              color: '#111827',
              marginBottom: '4px',
              position: 'relative',
              textTransform: 'uppercase'
            }}>
              {resume.title || 'UNTITLED RESUME'}
              {/* Simple underline - only when not PDF */}
              {!isPdf && (
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '64px',
                  height: '4px',
                  backgroundColor: '#6366f1'
                }}></div>
              )}
            </h1>
            
            <p style={{
              fontSize: isPdf ? '12pt' : '18px',
              color: '#4b5563',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {resume.jobTitle || 'No Job Title'}
            </p>
          </header>
  
          {resume.summary && (
            <section style={{ marginBottom: '24px', position: 'relative' }}>
              <h2 style={{
                fontSize: isPdf ? '11pt' : '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                position: 'relative'
              }}>
                About Me
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#6366f1'
                }}></div>
              </h2>
              <p style={{
                color: '#374151',
                lineHeight: '1.6',
                fontSize: isPdf ? '10pt' : '14px',
                borderLeft: '4px solid #e5e7eb',
                paddingLeft: '16px'
              }}>
                {resume.summary}
              </p>
            </section>
          )}
  
          {experience.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: isPdf ? '11pt' : '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                position: 'relative'
              }}>
                Experience
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#8b5cf6'
                }}></div>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {experience.map((exp, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderLeft: '2px solid #f3f4f6',
                    paddingLeft: '24px',
                    paddingBottom: '16px'
                  }}>
                    {/* Simple timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-8px',
                      top: 0,
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#6366f1',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}></div>
                    
                    <h3 style={{
                      fontSize: isPdf ? '10pt' : '16px',
                      fontWeight: 'bold',
                      color: '#111827',
                      margin: 0
                    }}>
                      {exp.title || 'Untitled Position'}
                    </h3>
                    
                    <p style={{
                      color: '#6366f1',
                      fontWeight: '600',
                      fontSize: isPdf ? '9pt' : '14px',
                      margin: '2px 0'
                    }}>
                      {exp.company || 'No Company'}
                    </p>
                    
                    <p style={{
                      fontSize: isPdf ? '8pt' : '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </p>
                    
                    {exp.description && (
                      <p style={{
                        color: '#374151',
                        fontSize: isPdf ? '9pt' : '14px',
                        lineHeight: '1.6'
                      }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
  
        <div style={{
          borderLeft: '2px solid #f3f4f6',
          paddingLeft: '24px',
          position: 'relative'
        }}>
          {/* Side accent bar */}
          <div style={{
            position: 'absolute',
            left: '-4px',
            top: 0,
            width: '8px',
            height: '48px',
            backgroundColor: '#f472b6',
            borderRadius: '9999px'
          }}></div>
          
          {education.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: isPdf ? '11pt' : '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                position: 'relative'
              }}>
                Education
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#ec4899'
                }}></div>
              </h2>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontSize: isPdf ? '10pt' : '16px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {edu.degree || 'No Degree'}
                  </h3>
                  <p style={{
                    color: '#ec4899',
                    fontWeight: '600',
                    fontSize: isPdf ? '9pt' : '14px',
                    marginBottom: '4px'
                  }}>
                    {edu.institution || 'No Institution'}
                  </p>
                  <p style={{
                    fontSize: isPdf ? '8pt' : '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </section>
          )}
  
          {skills.length > 0 && (
            <section>
              <h2 style={{
                fontSize: isPdf ? '11pt' : '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                position: 'relative'
              }}>
                Skills
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#f97316'
                }}></div>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: isPdf ? '9pt' : '14px',
                      color: '#374151',
                      fontWeight: '500',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      borderBottom: index < skills.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    {skill || 'Unnamed Skill'}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderExecutive = () => (
    <div 
      className="resume-template executive"
      style={{
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        margin: 0,
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '32px',
        boxSizing: 'border-box',
        border: '2px solid #e5e7eb'
      }}
    >
      <header style={{ 
        marginBottom: '32px', 
        textAlign: 'center',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '16px'
      }}>
        <h1 style={{
          fontSize: isPdf ? '28pt' : '36px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px',
          margin: 0
        }}>
          {resume.title || 'Untitled Resume'}
        </h1>
        <p style={{
          fontSize: isPdf ? '16pt' : '24px',
          color: '#6b7280',
          margin: 0
        }}>
          {resume.jobTitle || 'No Job Title'}
        </p>
      </header>

      {resume.summary && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: isPdf ? '14pt' : '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '8px',
            margin: '0 0 16px 0'
          }}>
            Professional Summary
          </h2>
          <p style={{
            color: '#374151',
            fontSize: isPdf ? '11pt' : '18px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {resume.summary}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: isPdf ? '14pt' : '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '8px',
            margin: '0 0 16px 0'
          }}>
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: isPdf ? '12pt' : '20px',
                fontWeight: '500',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                {exp.title || 'Untitled Position'}
              </h3>
              <p style={{
                fontSize: isPdf ? '11pt' : '18px',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                {exp.company || 'No Company'}
              </p>
              <p style={{
                fontSize: isPdf ? '9pt' : '14px',
                color: '#9ca3af',
                margin: '0 0 8px 0'
              }}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </p>
              {exp.description && (
                <p style={{
                  color: '#374151',
                  marginTop: '8px',
                  fontSize: isPdf ? '10pt' : '18px',
                  lineHeight: '1.6',
                  margin: '8px 0 0 0'
                }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px'
      }}>
        {education.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: isPdf ? '14pt' : '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
              margin: '0 0 16px 0'
            }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: isPdf ? '12pt' : '20px',
                  fontWeight: '500',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  {edu.degree || 'No Degree'}
                </h3>
                <p style={{
                  fontSize: isPdf ? '11pt' : '18px',
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  {edu.institution || 'No Institution'}
                </p>
                <p style={{
                  fontSize: isPdf ? '9pt' : '14px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: isPdf ? '14pt' : '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
              margin: '0 0 16px 0'
            }}>
              Skills
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '9999px',
                    fontSize: isPdf ? '10pt' : '18px'
                  }}
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