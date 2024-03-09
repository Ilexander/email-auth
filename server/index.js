const express = require('express');
const { createMqChannel } = require('./mq/scripts');

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(express.json());

const sendToTechical = async (message) => {
    const queue = 'technical'
    const { connection, channel } = await createMqChannel(queue)

    channel.sendToQueue(queue, Buffer.from(message))

    setTimeout(() => {
        connection.close()
    }, 1000);
}

app.post('/send-message', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
        };

        console.log(`Start email sending`);
        sendToTechical(JSON.stringify(mailOptions)) // Mq must send message "Email sent" when message was sended
        console.log(`Continue email sending`);

        return res.status(200).json({ status: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});
