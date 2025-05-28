// src/components/Card.js
import React from "react";

const Card = ({ card, handleChoice, flipped, disabled }) => {
  // When the card is clicked, call handleChoice (unless it's disabled or already flipped)
  const handleClick = () => {
    if (!disabled && !flipped) {
      handleChoice(card);
    }
  };

  return (
    // The outer div sets the card size and applies a perspective so the 3D transform works.
    <div className="w-32 h-48 cursor-pointer perspective" onClick={handleClick}>
      {/* The inner div rotates based on the flipped prop */}
      <div
        className="relative w-full h-full duration-500 border-2 border-gray-500 rounded"
        style={{
        //when flipped, show the front (rotateY(0deg)); otherwise, show the back.
          transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Side: shows the symbol */}
        <div
          className="absolute w-full h-full bg-blue-200 rounded flex items-center justify-center text-5xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {card.symbol}
        </div>
        {/* Back Side: shows a "?" */}
        <div
          className="absolute w-full h-full bg-blue-500 rounded flex items-center justify-center text-5xl"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          ?
        </div>
      </div>
    </div>
  );
};

export default Card;