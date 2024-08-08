import styled from 'styled-components';

export function Board({ board, onMove }) {
    return (
        <_Board>
            {board.map((row, y) => {
                return row.map((cell, x) => (
                    <Cell key={`${x},${y}`} onClick={() => onMove(x, y)}>
                        {cell}
                    </Cell>
                ));
            })}
        </_Board>
    );
}

const _Board = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    gap: 5px;
`;

const Cell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background-color: #fff;
    border: 2px solid #000;
    color: #000;
    font-size: 2em;
    cursor: pointer;

    &:hover {
        background-color: #f1f1f1;
    }
`;
