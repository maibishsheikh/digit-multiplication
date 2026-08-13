// src/features/simulate/simulations/MultiplicationSentence.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import NumberPad from '../../../components/NumberPad.jsx';
import { sounds } from '../../../utils/audio.js';
import { genMultiplication, pick } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;
const SLOTS = ['factorA', 'factorB', 'product'];

function genRound(roundIdx) {
  // Alternate digit patterns each round so both 4×1 and 3×2 get practiced
  const forceType = roundIdx % 2 === 0 ? '4x1' : '3x2';
  const { digitType, factorA, factorB, product } = genMultiplication(1, forceType); // kid-friendly numbers for Simulate
  const missing = pick(SLOTS);
  const answer = { factorA, factorB, product }[missing];
  return { digitType, factorA, factorB, product, missing, answer };
}

export default function MultiplicationSentence({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [value, setValue]         = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = (idx) => { setSetup(genRound(idx)); setValue(''); setConfirmed(false); };
  useEffect(() => { newRound(0); }, []);
  if (!setup) return null;

  const isCorrect = Number(value) === setup.answer;
  const { factorA, factorB, product, missing } = setup;

  const handleSubmit = () => {
    if (!value || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore((s) => s + 1); } else { sounds.wrong(); }
  };
  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next); newRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6,
        fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score}/{round}</span>
      </div>

      <p className="sim-instruction">Fill in the blank!</p>

      {/* ── Hint line — nudges toward the missing-factor strategy
           BEFORE the student answers (always visible, not hint-gated) ── */}
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 8, textAlign: 'center' }}>
        💡 Think: {missing === 'product' && `${factorA} × ${factorB} = ?`}
        {missing === 'factorA' && `? × ${factorB} = ${product}  (divide ${product} ÷ ${factorB})`}
        {missing === 'factorB' && `${factorA} × ? = ${product}  (divide ${product} ÷ ${factorA})`}
      </p>

      {/* ── Multiplication sentence ── */}
      <div className="number-sentence">
        <span className="ns-num">{missing === 'factorA' ? (value || '?') : factorA}</span>
        <span className="ns-op">×</span>
        <span className="ns-num">{missing === 'factorB' ? (value || '?') : factorB}</span>
        <span className="ns-op">=</span>
        <span className="ns-blank">{missing === 'product' ? (value || '?') : product}</span>
      </div>

      {/* ── Number pad (hidden after confirm) ── */}
      {!confirmed && <NumberPad value={value} onChange={setValue} onSubmit={handleSubmit} maxLength={6} />}

      {/* ── Action — always at bottom ── */}
      <div style={{ marginTop: 'auto', paddingTop: 8, flexShrink: 0 }}>
        {!confirmed ? (
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!value} style={{ width: '100%' }}>
            Check Answer ✓
          </Button>
        ) : (
          <>
            <div style={{
              padding: '8px 14px', borderRadius: 'var(--radius-md)', marginBottom: 8,
              background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
              border: `1px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center',
            }}>
              {isCorrect ? '🎉 Correct! You completed the multiplication sentence!' : `❌ Answer: ${setup.answer}`}
            </div>
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
