const express = require('express')
const mongoose = require('mongoose')

const cors = require('cors')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resume'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SmartCV AI Backend' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcv')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

