import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Game } from './Game.js';

const app = express();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const games = new Map();

io.on('connection', function (socket) {
    console.log(`New connection - ${socket.id}`);
    socket.emit('connection', 'successful');

    socket.on('join-game', (gameId) => {
        try {
            if (!gameId) {
                throw new Error(`Must pass gameId`);
            }

            const prevGameId = Array.from(games.keys()).find((id) => games.get(id).players.has(socket.id));
            if (prevGameId) {
                throw new Error(`Can't connect to two games at a time`);
            }

            let game = games.get(gameId);
            if (!games.has(gameId)) {
                game = new Game(gameId);
                games.set(gameId, game);
            }

            game.addPlayer(socket.id);

            socket.join(gameId);
            io.to(gameId).emit('gameState', game.getState());

            socket.emit('join-game', { gameId });
            console.log(`${socket.id} Joined Game ${gameId}`);
        } catch (e) {
            socket.emit('join-game', { error: e.message });
        }
    });

    socket.on('disconnecting', () => {
        const gameId = Array.from(games.keys()).find((id) => games.get(id).players.has(socket.id));
        if (gameId) {
            const game = games.get(gameId);
            game.removePlayer(socket.id);
            if (game.players.size === 0) {
                games.delete(gameId);
            }
        }
    });

    socket.on('move', (gameId, x, y) => {
        try {
            const game = games.get(gameId);
            if (!game) {
                throw new Error('Game does not exist');
            }

            game.makeMove(socket.id, x, y);
            io.to(gameId).emit('gameState', game.getState());

            const end = game.checkEnd();
            if (end) {
                io.to(gameId).emit('game-end', { end });
            }
        } catch (e) {
            socket.emit('move', { error: e.message });
        }
    });
});

server.listen(port, () => {
    console.log('listening on port 3000');
});
