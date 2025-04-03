
import React from 'react';
import { Link } from 'react-router-dom';
import './jugar.css';

export default function Jugar() {
  return (
    <div className="jugar">
      <div className="jugar__container">
        <h1 className="jugar__title">Jugar</h1>
        <p className="jugar__description">
          En esta sección podrás jugar a la trivia y adivinar los resultados
          de los juegos.
        </p>
        <Link to="/jugar">
          <button className="jugar__button">Jugar</button>
        </Link>
      </div>
    </div>
  );
}