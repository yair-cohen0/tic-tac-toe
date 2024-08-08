import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Game } from './Game.js';

const app = express();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

const game = new Game();

io.on('connection', function (socket) {
    try {
        game.addPlayer(socket.id);
        socket.emit('connection', 'successfully joined game!');
    } catch (e) {
        socket.emit('connection', { error: e.message });
        socket.disconnect();
    }

    socket.on('clicked', (x, y) => {
        try {
            game.makeMove(socket.id, x, y);
            io.emit('gameState', game.getState());
        } catch (e) {
            socket.emit('clicked', { error: e.message });
        }
    });
});

server.listen(port, () => {
    console.log('listening on port 3000');
});
