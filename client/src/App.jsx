import './App.css';
import { useCallback, useState } from 'react';
import { Board } from './components/Board';

function App() {
    const [board, setBoard] = useState(
        Array(3)
            .fill(null)
            .map(() => Array(3).fill(null)),
    );

    const onMove = useCallback((x, y) => {
        console.log(x, y);
    }, []);

    return (
        <>
            <Board board={board} onMove={onMove}></Board>
        </>
    );
}

export default App;
