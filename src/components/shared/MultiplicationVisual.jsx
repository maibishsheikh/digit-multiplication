// src/components/shared/MultiplicationVisual.jsx
import React from 'react';
import MultiplicationTriangle from '../MultiplicationTriangle.jsx';
import VerticalMultiplication from '../VerticalMultiplication.jsx';
import AreaModelDiagram from '../AreaModelDiagram.jsx';

export default function MultiplicationVisual({ question, compact = false }) {
  if (!question) return null;
  const { visual, factorA, factorB, product, missingSlot, parts, chosenPart, itemEmoji } = question;

  if (visual === 'triangle' || question.mixedVisual === 'triangle') {
    return (
      <div style={{ maxWidth: compact ? 220 : 280, margin: '0 auto', width: '100%' }}>
        <MultiplicationTriangle
          factorA={factorA}
          factorB={factorB}
          product={product}
          missing={missingSlot || 'none'}
        />
      </div>
    );
  }

  if (visual === 'vertical' || question.mixedVisual === 'vertical') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
        <VerticalMultiplication factorA={factorA} factorB={factorB} />
      </div>
    );
  }

  if (visual === 'areaModel' && parts) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '4px 0', width: '100%' }}>
        <AreaModelDiagram factorB={factorB} parts={parts} chosenPart={chosenPart} />
      </div>
    );
  }

  if (visual === 'word' && itemEmoji) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', fontSize: '1.8rem', padding: '4px 0' }}>
        {[...Array(Math.min(factorB > 10 ? 6 : factorB, 6))].map((_, i) => (
          <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.05}s` }}>
            {itemEmoji}
          </span>
        ))}
      </div>
    );
  }

  if (visual === 'sentence') {
    return (
      <div style={{
        background: 'rgba(255, 193, 7, 0.12)',
        border: '1.5px solid rgba(255, 193, 7, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 20px',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '1.3rem',
        color: 'var(--gold)',
      }}>
        {factorA ? factorA.toLocaleString() : ''} × {factorB ? factorB.toLocaleString() : ''} = {product ? product.toLocaleString() : '?'}
      </div>
    );
  }

  return null;
}
