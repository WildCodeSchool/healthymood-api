require('dotenv').config();
const nodemailer = require('nodemailer');

// mail send
class mailer {
  static async sendMail(sendRecipePayload) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // TODO: your gmail account
        pass: process.env.PASSWORD // TODO: your gmail password
      }
    });

    const mailOptions = {
      from: sendRecipePayload.email, // TODO: email sender
      to: process.env.EMAIL, // TODO: email receiver
      subject: 'healthymood - Test',
      text: sendRecipePayload.text
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
