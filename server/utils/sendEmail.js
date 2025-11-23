// server/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create the transporter (essentially logging into Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"MindAid Support" <${process.env.EMAIL_USER}>`, // Sender address
    to: options.email, // Receiver address
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
    html: options.html, // HTML body (optional but good for styling)
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;