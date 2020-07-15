require('dotenv').config();
const nodemailer = require('nodemailer');

// mail send
class mailer {
  static async sendMail () {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // TODO: your gmail account
        pass: process.env.PASSWORD // TODO: your gmail password
      }
    });

    const mailOptions = {
      from: 'healthymoodtest@gmail.com', // TODO: email sender
      to: 'adama.sonko6978@gmail.com', // TODO: email receiver
      subject: 'healthymood - Test',
      text: 'Does it works???!! second test'
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return console.log('Error');
      }
      return Promise.resolve(data);
    });
  }
}
module.exports = mailer;
