export class Game {
    constructor() {
        this.board = Array(3)
            .fill(null)
            .map(() => Array(3).fill(null));
        this.players = new Map();
        this.currentPlayer = true;
    }

    addPlayer(socketId) {
        if (this.players.size >= 2) {
            throw new Error('Too many players');
        }
        if (this.players.has(socketId)) {
            throw new Error('Already connected');
        }
        this.players.set(socketId, this.players.size === 0);
    }

    removePlayer(socketId) {
        if (this.players.has(socketId)) {
            this.players.delete(socketId);
        }
    }

    makeMove(socketId, x, y) {
        if (this.players.size <= 1) {
            throw new Error('Only one player');
        }
        if (!this.players.has(socketId)) {
            throw new Error('Player does not exist');
        }
        if (this.players.get(socketId) !== this.currentPlayer) {
            throw new Error('Not your turn');
        }
        if (this.board[y][x]) {
            throw new Error('Place Taken');
        }

        this.board[y][x] = playersEnum[this.players.get(socketId)];
        this.currentPlayer = !this.currentPlayer;
    }

    getState() {
        return { board: this.board, turn: this.currentPlayer };
    }
}

const playersEnum = {
    true: 'X',
    false: 'O',
};
