import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware - checking token...');
    console.log('Cookies:', req.cookies);
    
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET is not set'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully:', {
        id: decoded.id,
        email: decoded.email,
        exp: decoded.exp
      });
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log('Token has expired');
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      
      // Only store the necessary user info
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', {
        name: jwtError.name,
        message: jwtError.message
      });
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

export default auth; 