const nodemailer = require("nodemailer");

const notifyUser = (emailData, publishedNews) => {
  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    secure: true,
   // service: emailData.service,
    auth: emailData.auth,
    tls : { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    text: `${emailData.text}:\n${JSON.stringify(publishedNews)}}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = notifyUser;
