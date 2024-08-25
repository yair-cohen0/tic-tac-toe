export class Game {
    constructor(id, game) {
        this.id = game?.id || id;
        this.board =
            game?.board ||
            Array(3)
                .fill(null)
                .map(() => Array(3).fill(null));
        this.players = game?.players || {};
        this.currentPlayer = game?.currentPlayer || true;
    }

    addPlayer(socketId) {
        if (Object.keys(this.players).length >= 2) {
            throw new Error('Too many players');
        }
        if (this.players[socketId]) {
            throw new Error('Already connected');
        }

        // If no current is true else is set to opposite
        const current = !!Object.values(this.players)[0];
        this.players[socketId] = !current;
    }

    removePlayer(socketId) {
        if (this.players[socketId]) {
            delete this.players[socketId];
        }
    }

    makeMove(socketId, x, y) {
        if (Object.keys(this.players).length <= 1) {
            throw new Error('Only one player');
        }
        if (!this.players[socketId]) {
            throw new Error('Player does not exist');
        }
        if (this.players[socketId] !== this.currentPlayer) {
            throw new Error('Not your turn');
        }
        if (this.board[y][x]) {
            throw new Error('Place Taken');
        }

        this.board[y][x] = playersEnum[this.players[socketId]];
        this.currentPlayer = !this.currentPlayer;
    }

    getState() {
        return { board: this.board, turn: this.currentPlayer };
    }

    checkEnd() {
        const board = this.board;

        // Check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
                return board[row][0];
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
                return board[0][col];
            }
        }

        // Check diagonals
        if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2];
        }

        // Check draw
        if (board.every((row) => row.every((cell) => cell !== null))) {
            return 'draw';
        }

        // No win
        return null;
    }
}

const playersEnum = {
    true: 'X',
    false: 'O',
};
