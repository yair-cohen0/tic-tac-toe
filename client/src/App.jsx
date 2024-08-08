import './App.css';
import { socket } from './socket.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './components/Board';

function App() {
    const gameIdInput = useRef(null);
    const [gameId, setGameId] = useState(null);

    const joinGame = useCallback(() => {
        const gameId = gameIdInput.current.value;
        socket.emit('join-game', gameId);
    }, []);

    useEffect(() => {
        const onConnection = (e) => {
            console.log('connected successfully');
        };

        const gameStateUpdate = (res) => {
            setBoard(res.board);
        };

        const onJoinGame = (res) => {
            if (!res.error) {
                setGameId(res.gameId);
            } else {
                console.error(res);
            }
        };

        const onMove = (res) => {
            if (res.error) {
                console.error(res);
            }
        };

        const onGameEnd = (res) => {
            if (res.end === 'draw') {
                console.log('Game ended in a draw');
            } else {
                console.log(`${res.end} Won!`);
            }
        };

        socket.on('connection', onConnection);
        socket.on('gameState', gameStateUpdate);
        socket.on('join-game', onJoinGame);
        socket.on('move', onMove);
        socket.on('game-end', onGameEnd);

        return () => {
            socket.off('connection', onConnection);
            socket.off('gameState', gameStateUpdate);
            socket.off('join-game', onJoinGame);
            socket.off('move', onMove);
        };
    }, []);

    const [board, setBoard] = useState(
        Array(3)
            .fill(null)
            .map(() => Array(3).fill(null)),
    );

    const onMove = useCallback(
        (x, y) => {
            socket.emit('move', gameId, x, y);
        },
        [gameId],
    );

    return (
        <>
            <input ref={gameIdInput} />
            <button onClick={joinGame}>Join</button>
            <Board board={board} onMove={onMove}></Board>
        </>
    );
}

export default App;
