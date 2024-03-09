const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_FROM_PASS,
    },
});


module.exports = transporter