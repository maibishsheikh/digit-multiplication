// src/components/shared/FeedbackOverlay.jsx
import React from 'react';
import './FeedbackOverlay.css';

export default function FeedbackOverlay({ isCorrect, explanation, onContinue }) {
  return (
    <div className="feedback-backdrop" onClick={onContinue} role="button" tabIndex={0}>
      <div
        className={`feedback-popup ${isCorrect ? 'popup-correct anim-bounce-in' : 'popup-incorrect anim-shake'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-icon">{isCorrect ? '🎉' : '💡'}</div>
        <h3 className="feedback-title">{isCorrect ? 'Brilliant!' : 'Not Quite!'}</h3>
        {explanation && <p className="feedback-text">{explanation}</p>}
        <button className={`feedback-btn ${isCorrect ? 'btn-green' : 'btn-primary'}`} onClick={onContinue}>
          {isCorrect ? 'Continue ✨' : 'Got It →'}
        </button>
      </div>
    </div>
  );
}
