import React from 'react';
import '../styles/Card.css';

function Card({ title, image, link , text1, text2}) {
  return (
    <a href={link} className="card">
      <img src={image} alt={title} />
      <div className='cardText'>
      <span className='titleCard'>{title}</span> 
      <span className='text1'>{text1}</span>
      <span className='text2'>{text2}</span>
      </div>
    </a>
  );
}

export default Card;
