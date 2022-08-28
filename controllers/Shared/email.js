
const nodemailer = require('nodemailer');
require("dotenv").config();


const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'biisplusplus@gmail.com',
        pass: process.env.MAIL_PASSWORD,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

const sendMail = (to, subject, text) => {
    //const {to, subject, text } = req.body;
    console.log(text);
    const mailData = {
        from: 'biisplusplus@gmail.com',
        to: to,
        subject: subject,
        text: text,
        //html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
};

exports.sendMail = sendMail;



