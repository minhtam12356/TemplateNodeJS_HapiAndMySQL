require('dotenv').config();
const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendTestEmail() {
  let mailBody = "";
  mailBody += "THÔNG BÁO!" + "\r\n\r\n";
  let subject = "[THÔNG BÁO] đây là email test hệ thống";
  await sendEmail("chaupad@gmail.com", subject, mailBody);
}

async function sendEmail(receiver, subject, body, html, emailClient) {
  let emailData = {
    from: `<${process.env.SMTP_EMAIL}>`,
    to: receiver,
    subject: subject,
  }

  if (emailClient) {
    try {
      emailData.from = emailClient.options.auth.user;
    } catch (error) {
      console.error(`can not get email of emailClient`)
      console.error(error);

      //if error, then use default
      emailData.from = `<${process.env.SMTP_EMAIL}>`;
    }
  }

  if (body) {
    emailData.text = body;
  }

  if (html) {
    emailData.html = html;
  }

  return new Promise((resolve, reject) => {
    if (emailClient === undefined) {
      emailClient = emailTransporter;
    };

    emailClient.sendMail(emailData, (err, info) => {
      if (err) {
        console.error("Send email error: " + err);
        console.error(info);
        reject(undefined);
      }
      if (info && info.messageId) {
        resolve(info.messageId);
      } else {
        reject(undefined);
      }
    });

  });
}

async function createNewClient(smtpHost, smtpPort, smtpSecure, email, password) {
  const emailClient = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: email,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return emailClient;
}

module.exports = {
  sendEmail,
  sendTestEmail,
  createNewClient
};
