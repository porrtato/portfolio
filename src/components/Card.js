import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';

import '../styles/Card.css';
import clickSound from '../sounds/menuhit.wav'; // Add the path to your sound file here
import hoverSound from '../sounds/menuclick.wav';

function Card({ title, image, link, text1, text2, index, isCenter }) {
  const [isClicked, setIsClicked] = useState(false);
  const [play] = useSound(clickSound, { volume: 0.1 }); // Initialize sound hook
  const [playHover] = useSound(hoverSound, { volume: 0.1 });

  const handleClick = (e) => {
    // Play the sound
    play();

    // Set this card as clicked
    setIsClicked(true);

    // Dispatch a custom event with this card's index
    window.dispatchEvent(new CustomEvent('cardClicked', { detail: { clickedIndex: index } }));
  };

  useEffect(() => {
    const handleCardReset = (e) => {
      if (e.detail.clickedIndex !== index) {
        setIsClicked(false);
      }
    };

    window.addEventListener('cardClicked', handleCardReset);
    return () => {
      window.removeEventListener('cardClicked', handleCardReset);
    };
  }, [index]);

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
      onMouseEnter={playHover}
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
