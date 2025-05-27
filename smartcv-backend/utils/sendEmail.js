const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create test account
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  // Define email options
  const message = {
    from: `SmartCv <${testAccount.user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return info;
};

module.exports = sendEmail; 