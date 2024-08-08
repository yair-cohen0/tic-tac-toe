import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

let clickCount = 0;

app.get('/', function (req, res, next) {
    res.send('Hello World!');
});

io.on('connection', function (socket) {
    socket.emit('connection', 'connected!');

    socket.on('clicked', (data, callback) => {
        clickCount++;
        io.emit('clicked', clickCount);
    });
});

server.listen(port, () => {
    console.log('listening on port 3000');
});
