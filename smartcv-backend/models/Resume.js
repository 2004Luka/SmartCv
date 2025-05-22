const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Please provide a summary']
  },
  experience: [{
    company: {
      type: String,
      required: [true, 'Please provide a company name']
    },
    position: {
      type: String,
      required: [true, 'Please provide a position']
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: Date,
    description: {
      type: String,
      required: [true, 'Please provide a description']
    }
  }],
  education: [{
    school: {
      type: String,
      required: [true, 'Please provide a school name']
    },
    degree: {
      type: String,
      required: [true, 'Please provide a degree']
    },
    field: {
      type: String,
      required: [true, 'Please provide a field of study']
    },
    graduationDate: {
      type: Date,
      required: [true, 'Please provide a graduation date']
    }
  }],
  skills: [{
    type: String,
    required: [true, 'Please provide at least one skill']
  }],
  template: {
    type: String,
    enum: ['professional', 'creative', 'executive'],
    default: 'professional'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema); 