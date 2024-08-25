import amqp from 'amqplib';

let rabbitChannel;
const queue = 'game_moves';

export const setupRabbitMQ = async (callback) => {
    const connection = await amqp.connect('amqp://localhost:5672', { durable: true });
    rabbitChannel = await connection.createChannel();
    await rabbitChannel.purgeQueue(queue);
    await rabbitChannel.assertQueue(queue);

    await rabbitChannel.consume(
        queue,
        async (e) => {
            console.log('ok');
            callback(JSON.parse(e.content.toString()));
        },
        { noAck: false },
    );
};

export const pushToQueue = async (game) => {
    rabbitChannel.sendToQueue(
        queue,
        Buffer.from(
            JSON.stringify({
                game,
            }),
        ),
    );
};
