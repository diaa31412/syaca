const nodemailer = require('nodemailer');
const dotenv= require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // or use 'smtp.mailtrap.io' for development
  auth: {
    user: process.env.USER_EMAIL ,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"My App" ${process.env.USER_EMAIL }`,
    to,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};
