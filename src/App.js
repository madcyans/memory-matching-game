import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import "./App.css"; // Contains our Tailwind directives, custom CSS, and our animation classes

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
  // Game state variables
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("bestScore")) || Infinity
  );

  // Weather state (e.g., "Clear", "Rain", "Cloudy")
  const [weather, setWeather] = useState(null);

  // Initialize the cards when the component mounts.
  useEffect(() => {
    setCards(shuffleArray([...initialCards]));
  }, []);

  // Handle a card click.
  const handleChoice = (card) => {
    if (!firstChoice) {
      setFirstChoice(card);
    } else if (card.id !== firstChoice.id) {
      setSecondChoice(card);
    }
  };

  // Check for matching cards when two choices are made.
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.symbol === secondChoice.symbol) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstChoice.symbol ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
      setMoves((prevMoves) => prevMoves + 1);
    }
  }, [firstChoice, secondChoice]);

  // Reset selections for the next turn.
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Update best score when all cards are matched.
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      if (moves < bestScore) {
        localStorage.setItem("bestScore", moves);
        setBestScore(moves);
      }
    }
  }, [cards, moves, bestScore]);

  // Fetch current weather using user's geolocation.
  useEffect(() => {
    console.log("Weather API Key:", process.env.REACT_APP_WEATHER_API_KEY);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log("Coordinates:", latitude, longitude);
          fetch(
            `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${latitude},${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("Weather data received:", data);
              setWeather(data.current.condition.text);
            })
            .catch((err) => console.error("Weather API error:", err));
        },
        (error) => console.error("Geolocation error:", error)
      );
    } else {
      console.error("Geolocation is not available");
    }
  }, []);

  // Determine background style based on the weather.
const getBackgroundStyle = () => {
  if (weather) {
    const condition = weather.toLowerCase();
    if (
      condition.includes("rain") ||
      condition.includes("thunder") ||
      condition.includes("drizzle") ||
      condition.includes("storm")
    ) {
      return {
        backgroundColor: "#94a3b8",
        backgroundImage: "url('/images/rain.png')",
        backgroundRepeat: "repeat-y",
        backgroundSize: "auto",
        // Let the animation keyframes control backgroundPosition
      };
    } else if (
      condition.includes("cloud") ||
      condition.includes("overcast") ||
      condition.includes("mist")
    ) {
      return {
        backgroundColor: "#e2e8f0",
        backgroundImage: "url('/images/cloud.png')",
        backgroundRepeat: "repeat-x",
        // Using "auto" instead of "cover" so the image is larger and panning is noticeable.
        backgroundSize: "auto",
        // Remove backgroundPosition so the animate-sun keyframes can take effect.
      };
    } else if (
      condition.includes("clear") ||
      condition.includes("sunny") ||
      condition.includes("fair")
    ) {
      return {
        backgroundColor: "#bbf7d0",
        backgroundImage: "url('/images/clear.png')",
        backgroundRepeat: "repeat-x",
        backgroundSize: "contain",
        // No inline backgroundPosition here
      };
    }
  }
  // Default style if weather is not set
  return {
    backgroundColor: "#bbf7d0",
    backgroundImage: "url('/images/clear.png')",
    backgroundRepeat: "repeat-x",
    backgroundSize: "contain",
  };
};

  // Determine which animation class to use based on weather.
  const animationClass =
    weather &&
    (weather.toLowerCase().includes("rain") ||
      weather.toLowerCase().includes("thunder") ||
      weather.toLowerCase().includes("drizzle") ||
      weather.toLowerCase().includes("storm"))
      ? "animate-rain"
      : "animate-sun";

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${animationClass} full-screen-container`}
      style={getBackgroundStyle()}
    >
      {/* Weather display in the top-right corner */}
      <div className="absolute top-4 right-4 bg-gray-800 text-cyan-200 px-4 py-2 rounded shadow-lg flex items-center gap-2">
        <span className="text-lg font-semibold">Weather:</span>
        {weather ? (
          <span className="text-base">{weather}</span>
        ) : (
          <span className="text-sm text-gray-400">Loading...</span>
        )}
      </div>
      <div className="relative flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold text-gray-800 my-12">
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