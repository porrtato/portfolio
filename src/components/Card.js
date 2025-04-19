import React, { useState, useEffect } from 'react';
import '../styles/Card.css';

function Card({ title, image, link, text1, text2, index, isCenter }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    // Set this card as clicked
    setIsClicked(true);
    // Dispatch a custom event with this card's index
    window.dispatchEvent(new CustomEvent('cardClicked', { detail: { clickedIndex: index } }));
  };

  // Whenever another card is clicked, update our state appropriately.
  useEffect(() => {
    const handleCardReset = (e) => {
      // If the clicked index does not match this card's index, reset local state.
      if (e.detail.clickedIndex !== index) {
        setIsClicked(false);
      }
    };

    window.addEventListener('cardClicked', handleCardReset);
    return () => {
      window.removeEventListener('cardClicked', handleCardReset);
    };
  }, [index]);

  // When clicked, apply additional translateX(-30px)
  const transformStyle =
    isClicked
      ? `translateX(-70px)`
      : ``;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      onClick={handleClick}
      style={{
        backgroundColor: isClicked ? 'rgba(59, 86, 136, 0.6)' : 'rgba(79, 38, 118, 0.6)',
        transform: transformStyle,
      }}
    >
      <img src={image} alt={title} />
      <div className="cardText">
        <span className="titleCard">{title}</span>
        <span className="text1">{text1}</span>
        <span className="text2">{text2}</span>
      </div>
    </a>
  );
}

export default Card;
