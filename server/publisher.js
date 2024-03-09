const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    try {
        if (err) throw err

        connection.createChannel((err, channel) => {
            if (err) throw err

            const queueName = 'technical'
            const message = 'technical Babaji'

            channel.assertQueue(queueName, {
                durabel: false
            })

            channel.sendToQueue(queueName, Buffer.from(message))
            console.log('Message');
            setTimeout(() => {
                connection.close()
            }, 1000);
        })

    } catch (error) {
        console.error(error);
    }
})