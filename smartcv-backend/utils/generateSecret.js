const crypto = require('crypto');

/**
 * Generates a secure random string to be used as JWT secret
 * @param {number} length - Length of the secret (default: 64)
 * @returns {string} A secure random string
 */
const generateJWTSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate a secret if this file is run directly
if (require.main === module) {
  const secret = generateJWTSecret();
  console.log('Generated JWT Secret:');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log(`JWT_SECRET=${secret}`);
}

module.exports = generateJWTSecret; 