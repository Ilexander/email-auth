const { createMqChannel } = require('./mq/scripts');
const mailTransporter = require('./mailer/index.js')
require('dotenv').config()

const sendMailMessage = (channel, msg) => {
    if (msg !== null) {
        const mailOptions = JSON.parse(msg.content.toString())

        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        })

        channel.ack(msg);
    }
}

const subscribeToTechnical = async () => {
    try {
        const queue = 'technical'
        const { channel } = await createMqChannel(queue)

        channel.consume(queue, (msg) => sendMailMessage(channel, msg));
    } catch (error) {
        console.error(error);
    }
}

subscribeToTechnical()