// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import MultiplicationTriangle from '../../components/MultiplicationTriangle.jsx';
import VerticalMultiplication from '../../components/VerticalMultiplication.jsx';
import AreaModelDiagram from '../../components/AreaModelDiagram.jsx';

/**
 * Renders a single question card with topic badge, visual aid,
 * question text, option grid, optional hint, and mascot row.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const { type, questionText, visual, mixedVisual, options, correctAnswer, explanation,
    factorA, factorB, product, parts, chosenPart, missingSlot, itemEmoji } = question;

  const topicLabel = type.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  const effectiveVisual = visual === 'mixed' ? mixedVisual : visual;

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Visual aid */}
      {effectiveVisual === 'triangle' && (
        <div className="question-visual">
          <MultiplicationTriangle factorA={factorA} factorB={factorB} product={product} missing={missingSlot || 'none'} animated />
        </div>
      )}
      {effectiveVisual === 'vertical' && (
        <div className="question-visual">
          <VerticalMultiplication factorA={factorA} factorB={factorB} />
        </div>
      )}
      {effectiveVisual === 'areaModel' && (
        <div className="question-visual">
          <AreaModelDiagram factorB={factorB} parts={parts} chosenPart={chosenPart} />
        </div>
      )}
      {effectiveVisual === 'word' && itemEmoji && (
        <div className="question-visual" style={{ fontSize: '2.6rem', textAlign: 'center' }} role="img" aria-hidden="true">
          {itemEmoji}
        </div>
      )}

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>{question.hint1}</HintBubble>
      )}

      {/* Options */}
      <div className="options-grid">
        {options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
              {typeof opt === 'number' ? opt.toLocaleString() : opt}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🦊</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Think about breaking the number apart…"}
        </div>
      </div>
    </div>
  );
}
