import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Debug logging for route registration
console.log('Registering resume routes...');

// Test route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Resume routes are working!' });
});

// AI Resume Analysis - no auth required
router.post('/analyze', async (req, res) => {
  console.log('Received analyze request:', {
    body: req.body,
    headers: req.headers
  });
  
  try {
    const { resume, jobTitle } = req.body;
    
    if (!resume || !jobTitle) {
      console.log('Missing required fields:', { resume, jobTitle });
      return res.status(400).json({
        success: false,
        message: 'Resume and jobTitle are required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key is not configured'
      });
    }

    // Prepare the prompt for OpenAI
    const prompt = `Analyze this resume for a ${jobTitle} position and provide suggestions for improvement:

Title: ${resume.title}
Summary: ${resume.summary}
Experience: ${JSON.stringify(resume.experience)}
Skills: ${resume.skills.join(', ')}

Please provide specific suggestions for:
1. A more impactful professional summary
2. Experience descriptions that highlight achievements
3. Additional relevant skills for this position
4. Industry-specific keywords to include

Format the response as a JSON object with the following structure:
{
  "summary": "improved summary text",
  "experience": ["improved experience description 1", "improved experience description 2"],
  "skills": ["skill1", "skill2", "skill3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;

    console.log('Calling OpenAI API...');
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer and career coach. Provide specific, actionable suggestions to improve the resume."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log('OpenAI API response received');
    // Parse the response
    const suggestions = JSON.parse(completion.choices[0].message.content);

    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume'
    });
  }
});

export default router; 