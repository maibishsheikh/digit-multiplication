// src/components/quiz/QuestionRenderer.jsx
import React from 'react';
import './QuestionRenderer.css';
import MultiplicationVisual from '../shared/MultiplicationVisual.jsx';

function getCategoryTag(type) {
  switch (type) {
    case 'multiplicationTriangle':
      return 'MULTIPLICATION TRIANGLE';
    case 'verticalMultiplication':
      return 'STANDARD ALGORITHM';
    case 'areaModelPartialProduct':
    case 'areaModelTotal':
      return 'AREA MODEL (BREAK-APART)';
    case 'wordProblemRepeatedGroups':
    case 'wordProblemArrayContext':
      return 'REAL-WORLD PROBLEM';
    case 'missingFactor':
      return 'MISSING FACTOR';
    case 'estimationRounding':
      return 'ESTIMATION & ROUNDING';
    case 'trueFalseCheck':
      return 'TRUE / FALSE CHECK';
    case 'mixedReviewBoss':
      return 'BOSS REVIEW CHALLENGE';
    default:
      return 'MULTIPLICATION QUEST';
  }
}

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
}) {
  if (!question) return null;

  const { type, questionText, options, hint1, hint2 } = question;
  const categoryTag = getCategoryTag(type);

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">✖️</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Visual aid if available */}
      {question.visual && (
        <div className="qr-visual">
          <MultiplicationVisual question={question} compact={true} />
        </div>
      )}

      {/* Options — 2x2 grid or 2-col */}
      <div className={`qr-options ${options?.length === 2 ? 'two-cols' : 'four-cols'}`}>
        {options?.map((opt, i) => (
          <button
            key={i}
            className="qr-option"
            onClick={() => !isLocked && onAnswer(opt)}
            disabled={isLocked}
            aria-label={`Option: ${opt}`}
          >
            <span className="qr-opt-text">{typeof opt === 'number' ? opt.toLocaleString() : opt}</span>
          </button>
        ))}
      </div>

      {/* Hint display */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Action Row: Hint Button + Prev + Next in one sleek bar */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn-outline qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev
            </button>
          )}
          {onNext && (
            <button
              className="btn-primary qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
