const express = require('express');
const { createMqChannel } = require('./mq/scripts');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

const secret = {
    key: null
}

const sendToTechical = async (message) => {
    const queue = 'technical'
    const { connection, channel } = await createMqChannel(queue)

    channel.sendToQueue(queue, Buffer.from(message))

    setTimeout(() => {
        connection.close()
    }, 1000);
}

app.post('/send-code', async (req, res) => {
    try {
        const { to, } = req.body;
        secret.key = uuidv4();
        const secretKey = secret.key
        const text = `Your secret key: ${secretKey}`

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to,
            subject: 'Inc.',
            text,
        };

        console.log(`Start email sending`);
        sendToTechical(JSON.stringify(mailOptions)) // Mq must send message "Email sent" when message was sended
        console.log(`Continue email sending`);

        return res.status(200).json({ message: 'Code has sent to your e-mail' });
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

app.post('/code-confirm', async (req, res) => {
    try {
        const { code } = req.body
        const secretKey = secret.key

        if (!code || code !== secretKey) throw new Error('Code is not match!')

        return res.status(200).send({ message: 'Code has confirmed!' })
    } catch (error) {
        return res.status(500).json(error.message);
    }
})

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});
