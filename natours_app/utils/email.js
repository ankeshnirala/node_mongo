const nodemailer = require('nodemailer');

let sendEmail = async options => {
    // 1) create a transporter
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        // activate in gmail "less secure app" option
    });
    
    // 2) define the email options
    let mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3) sends the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;