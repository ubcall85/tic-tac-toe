import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const initialState = {
  squares: Array(9).fill(null),
  xIsNext: true,
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isBoardFull = (squares) => {
  return squares.every((square) => square !== null);
};

const Square = ({ value, onClick, disabled }) => (
  <button className={`square ${value}`} onClick={onClick} disabled={disabled}>
    {value}
  </button>
);

const Board = ({ squares, onClick, winner }) => (
  <div className="board">
    {squares.map((value, index) => (
      <Square key={index} value={value} onClick={() => onClick(index)} disabled={value || winner} />
    ))}
  </div>
);

const Game = () => {
  const [history, setHistory] = useState([initialState]);
  const [stepNumber, setStepNumber] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const current = history[stepNumber];

  useEffect(() => {
    if (winner) {
      setEndTime(new Date());
      openModal();
    }
  }, [winner]);
  

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const currentBoard = newHistory[newHistory.length - 1];
    const newSquares = currentBoard.squares.slice();

    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = current.xIsNext ? 'X' : 'O';
    setHistory([...newHistory, { squares: newSquares, xIsNext: !current.xIsNext }]);
    setStepNumber(newHistory.length);
    checkGameStatus(newSquares);
  };

  const checkGameStatus = (squares) => {
    const gameWinner = calculateWinner(squares);
    const boardFull = isBoardFull(squares);
  
    if (gameWinner) {
      setWinner(gameWinner);
      setEndTime(new Date());
    } else if (boardFull) {
      setWinner('Draw');
      setEndTime(new Date());
    }
  };
  

  const restartGame = () => {
    setHistory([initialState]);
    setStepNumber(0);
    setWinner(null);
    setStartTime(new Date());
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    restartGame();
  };

  const calculateGameDuration = () => {
    if (startTime && endTime) {
      const duration = Math.floor((endTime - startTime) / 1000); // в секундах
      return `${Math.floor(duration / 60)} min ${duration % 60} sec`;
    }
    return 'N/A';
  };

  const renderModalContent = () => {
    if (winner === 'Draw') {
      return (
        <div>
          <div>It's a draw!</div>
          <div className="timer">Game Duration: {calculateGameDuration()}</div>
        </div>
      );
    } else if (winner) {
      return (
        <div>
          <div>{`Winner: ${winner}`}</div>
          <div className="timer">Game Duration: {calculateGameDuration()}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="game">
      <div className="game-title">Tic Tac Toe</div>
      <div className="game-board">
        <div className="status">{`Next player: ${current.xIsNext ? 'X' : 'O'}`}</div>
        <Board squares={current.squares} onClick={handleClick} winner={winner} />
        <button className="button" onClick={restartGame}>
          Restart Game
        </button>
      </div>
      <div className="game-footer">Made with ❤️ by Ubcall85</div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal">
        <button className="modal-close" onClick={closeModal}>
          Close
        </button>
        <div className="modal-content">{renderModalContent()}</div>
      </Modal>
    </div>
  );
};

export default Game;
