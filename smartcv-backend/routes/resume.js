const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

router.use(protect); // All resume routes require authentication

router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

// AI Resume Analysis route
router.post('/analyze', async (req, res) => {
  try {
    // Dynamically require OpenAI and initialize after dotenv loads
    const { OpenAI } = require('openai');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const path = require('path');
      return res.status(500).json({
        success: false,
        message: `OPENAI_API_KEY is missing. .env path tried: ${path.resolve(__dirname, '../.env')}`
      });
    }
    const openai = new OpenAI({ apiKey });
    const { resume, jobTitle } = req.body;

    if (!resume || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Resume and job title are required'
      });
    }

    const prompt = `Analyze this resume for a ${jobTitle} position and provide specific suggestions for improvement:

Resume Details:
Personal Info: ${JSON.stringify(resume.personalInfo)}
Summary: ${resume.summary}

Experience:
${resume.experience.map(exp => `
- ${exp.position} at ${exp.company} (${exp.duration})
  ${exp.description}`).join('\n')}

Education:
${resume.education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}

Skills:
${resume.skills.join(', ')}

Please provide:
1. Key strengths
2. Areas for improvement
3. Specific suggestions for tailoring the resume to this role
4. Skills to highlight
5. Keywords to include`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional resume reviewer and career coach. Provide specific, actionable feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      res.json({
        success: true,
        suggestions: completion.choices[0].message.content
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      
      // Handle specific OpenAI API errors
      if (openaiError.status === 429) {
        return res.status(429).json({
          success: false,
          message: 'OpenAI API quota exceeded. Please check your API key and billing details.',
          error: 'QUOTA_EXCEEDED'
        });
      }

      // Handle other OpenAI API errors
      return res.status(500).json({
        success: false,
        message: 'Error connecting to OpenAI API. Please try again later.',
        error: 'OPENAI_ERROR'
      });
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: 'SERVER_ERROR'
    });
  }
});

module.exports = router; 