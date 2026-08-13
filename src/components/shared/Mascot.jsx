// src/components/shared/Mascot.jsx
import React from 'react';
import './Mascot.css';

export default function Mascot({ mood = 'happy', message, size = 'md' }) {
  const emoji = mood === 'curious' ? '🦊' : mood === 'excited' ? '🎉' : '🦊';

  return (
    <div className={`mascot-row mascot-${size}`}>
      <div className="mascot-circle">
        <span className="mascot-emoji">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-bubble">
          <p className="mascot-msg">{message}</p>
        </div>
      )}
    </div>
  );
}
