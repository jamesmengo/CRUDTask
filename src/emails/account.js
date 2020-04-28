const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "jamesmeng98@gmail.com",
    subject: "Welcome to TaskApp!",
    text: `Welcome, ${name}! We're excited to have you join us here at TaskApp`,
  });
};

const sendCancellationEmail = (email, name) => {
  console.log("yay");
  sgMail.send({
    to: email,
    from: "jamesmeng98@gmail.com",
    subject: "We're sorry to see you go",
    text: `We're sad to see that you're leaving, ${name}! Please let us know how we can improve.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
