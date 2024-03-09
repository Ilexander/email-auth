const amqp = require('amqplib');

const createConnection = async () => {
    // ... any other logic
    const connection = await amqp.connect('amqp://localhost');
    return connection
}

const createMqChannel = async (queue) => {
    // ... any other logic
    const connection = await createConnection()
    const channel = await connection.createChannel()

    channel.assertQueue(queue, {
        durabel: false
    })

    return { connection, channel }
}

module.exports = { createMqChannel, createConnection }