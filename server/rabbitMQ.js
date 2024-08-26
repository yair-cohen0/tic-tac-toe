import amqp from 'amqplib';

let rabbitChannel;
const exchange = 'game_moves';
const routingKey = '';
const queueName = '';

export const setupRabbitMQ = async (callback) => {
    const connection = await amqp.connect('amqp://localhost:5672', { durable: true });
    rabbitChannel = await connection.createChannel();
    rabbitChannel.assertExchange(exchange, 'fanout');
    const { queue } = await rabbitChannel.assertQueue(queueName, { exclusive: true });
    rabbitChannel.bindQueue(queue, exchange, routingKey);

    await rabbitChannel.consume(
        queue,
        async (e) => {
            callback(JSON.parse(e.content.toString()));
        },
        { noAck: true },
    );
};

export const pushToQueue = async (game) => {
    rabbitChannel.publish(
        exchange,
        routingKey,
        Buffer.from(
            JSON.stringify({
                game,
            }),
        ),
    );
};
