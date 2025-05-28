// src/App.js
import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import "./App.css"; // Contains our Tailwind directives and custom CSS

// Define the initial set of cards (each symbol appears twice)
const initialCards = [
  { id: 1, symbol: "🍎", matched: false },
  { id: 2, symbol: "🍎", matched: false },
  { id: 3, symbol: "🍌", matched: false },
  { id: 4, symbol: "🍌", matched: false },
  { id: 5, symbol: "🍇", matched: false },
  { id: 6, symbol: "🍇", matched: false },
  { id: 7, symbol: "🍓", matched: false },
  { id: 8, symbol: "🍓", matched: false },
  { id: 9, symbol: "🍊", matched: false },
  { id: 10, symbol: "🍊", matched: false },
  { id: 11, symbol: "🍍", matched: false },
  { id: 12, symbol: "🍍", matched: false },
  // Add more pairs if desired
];

// Utility function to shuffle the cards
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

function App() {
  // State variables for cards, selections, moves, and best score.
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || Infinity
  );

  // When the component mounts, initialize the cards by shuffling them.
  useEffect(() => {
    setCards(shuffleArray([...initialCards]));
  }, []);

  // Function to handle a card click.
  const handleChoice = (card) => {
    if (!firstChoice) {
      setFirstChoice(card);
    } else if (card.id !== firstChoice.id) {
      setSecondChoice(card);
    }
  };

  // When two cards are selected, check if they match.
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true); // Disable further clicks during check
      if (firstChoice.symbol === secondChoice.symbol) {
        // Mark matching cards
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstChoice.symbol ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        // Wait a moment so the user can see the cards, then flip back
        setTimeout(() => resetTurn(), 1000);
      }
      setMoves((prevMoves) => prevMoves + 1); // Increase move counter
    }
  }, [firstChoice, secondChoice]);

  // Reset selections for the next turn.
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Once all cards are matched, update the best score (if applicable).
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      if (moves < bestScore) {
        localStorage.setItem("bestScore", moves);
        setBestScore(moves);
      }
    }
  }, [cards, moves, bestScore]);

  return (
    <div
      className="relative min-h-screen overflow-hidden animate-fruits"
      style={{
        backgroundColor: "#bbf7d0", // Tailwind blue-500
        backgroundImage: "url('/fruits.png')",
        backgroundRepeat: "repeat-x",
        backgroundSize: "contain",  // Adjust as needed (or use 'cover', 'auto', etc.)
      }}
    >
      {/* Your game content */}
      <div className="relative flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold text-gray-800 my-4">
          Memory Matching Game
        </h1>
        <div className="text-lg text-gray-700">
          <span>Moves: {moves}</span>
          <span className="ml-4">
            Best Score: {bestScore !== Infinity ? bestScore : "N/A"}
          </span>
        </div>
        <Board
          cards={cards}
          handleChoice={handleChoice}
          firstChoice={firstChoice}
          secondChoice={secondChoice}
          disabled={disabled}
        />
        <button
          onClick={() => {
            // Restart the game by resetting states and shuffling cards
            setCards(shuffleArray([...initialCards]));
            setMoves(0);
            setFirstChoice(null);
            setSecondChoice(null);
            setDisabled(false);
          }}
          className="relative mt-8 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors duration-300"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;
