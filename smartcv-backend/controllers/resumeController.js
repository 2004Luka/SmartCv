const Resume = require('../models/Resume');

// Create a new resume
exports.createResume = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'jobTitle', 'summary'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate experience array
    if (!Array.isArray(req.body.experience) || req.body.experience.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one experience entry is required'
      });
    }

    // Validate education array
    if (!Array.isArray(req.body.education) || req.body.education.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one education entry is required'
      });
    }

    // Validate skills array
    if (!Array.isArray(req.body.skills) || req.body.skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one skill is required'
      });
    }

    const resumeData = {
      ...req.body,
      user: req.user._id
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Resume creation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create resume'
    });
  }
};

// Get all resumes for the current user
exports.getResumes = async (req, res) => {
  try {
    console.log('Fetching resumes for user:', req.user._id); // Debug log
    
    const resumes = await Resume.find({ user: req.user._id });
    console.log('Found resumes:', resumes); // Debug log
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Error fetching resumes:', error); // Debug log
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch resumes'
    });
  }
};

// Get a single resume
exports.getResume = async (req, res) => {
  try {
    console.log('Getting resume with ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    console.log('Found resume:', resume);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Format the resume data
    const formattedResume = {
      id: resume._id,
      title: resume.title,
      jobTitle: resume.jobTitle,
      summary: resume.summary,
      experience: resume.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      })),
      education: resume.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startDate,
        endDate: edu.endDate
      })),
      skills: resume.skills
    };

    console.log('Formatted resume data:', formattedResume);

    res.status(200).json({
      success: true,
      data: formattedResume
    });
  } catch (error) {
    console.error('Error in getResume:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving resume'
    });
  }
};

// Update a resume
exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
  try {
    console.log('Deleting resume with ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteResume:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting resume'
    });
  }
}; 