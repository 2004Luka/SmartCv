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
    const resumes = await Resume.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single resume
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

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
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    await resume.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 