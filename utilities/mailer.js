const nodemailer = require('nodemailer');
//Require dotenv
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'coral.johnny.2@gmail.com', // generated ethereal user
      pass: process.env.GMAIL_KEY, // generated ethereal password
    },
  });

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

module.exports = transporter;