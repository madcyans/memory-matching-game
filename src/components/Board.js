// src/components/Board.js
import React from "react";
import Card from "./Card";

const Board = ({ cards, handleChoice, firstChoice, secondChoice, disabled }) => {
  return (
    // A responsive grid:
    // - grid-cols-2 on smaller screens,
    // - md:grid-cols-3 on medium screens,
    // - lg:grid-cols-4 on large screens.
    <div className="grid grid-cols-3 gap-4 mt-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleChoice={handleChoice}
          // The card is flipped if it's either selected now or already matched.
          flipped={card === firstChoice || card === secondChoice || card.matched}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default Board;