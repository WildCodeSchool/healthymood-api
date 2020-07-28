require('dotenv').config();
const nodemailer = require('nodemailer');

// mail send
class mailer {
  static async sendMail (sendRecipePayload) {
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
      subject: `${sendRecipePayload.username} vient de soumettre une nouvelle recette`,
      text: `Auteur:\n${sendRecipePayload.username}\n\nMail:\n${sendRecipePayload.email}\n\nTitre de la recette:\n${sendRecipePayload.title}\n\nDétails de la recette:\n${sendRecipePayload.text}`
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return console.error('Error');
      }
      return Promise.resolve(data);
    });
  }
}
module.exports = mailer;
