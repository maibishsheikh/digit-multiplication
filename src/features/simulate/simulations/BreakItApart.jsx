// src/features/simulate/simulations/BreakItApart.jsx
//
// Learning goal: experience multiplication via the DISTRIBUTIVE PROPERTY
// (the "area model" / partial-products strategy).
// Students reveal one place-value chunk at a time, watch it get multiplied,
// then add all the partial products together to find the total.
//
// Key visual: factorA is broken into place-value tiles (e.g. 2,000 + 300 +
// 10 + 4). Tapping "Multiply Next Part" reveals that tile's partial product,
// building a running list, before the final MCQ for the total.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { sounds } from '../../../utils/audio.js';
import { genMultiplication, placeValueParts, generateProductDistractors } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;

function genRound(roundIdx) {
  // Alternate digit patterns each round so both 4×1 and 3×2 get practiced
  const forceType = roundIdx % 2 === 0 ? '4x1' : '3x2';
  const { digitType, factorA, factorB, product } = genMultiplication(1, forceType); // kid-friendly numbers for Simulate
  const parts = placeValueParts(factorA);
  return { digitType, factorA, factorB, product, parts };
}

export default function BreakItApart({ onComplete }) {
  const [round, setRound]           = useState(0);
  const [setup, setSetup]           = useState(null);
  const [revealed, setRevealed]     = useState(0);   // how many parts have been multiplied
  const [selected, setSelected]     = useState(null);
  const [confirmed, setConfirmed]   = useState(false);
  const [options, setOptions]       = useState([]);
  const [score, setScore]           = useState(0);

  const startNewRound = (idx) => {
    const s = genRound(idx);
    setSetup(s);
    setRevealed(0);
    setSelected(null);
    setConfirmed(false);
    setOptions(generateProductDistractors(s.product, { factorA: s.factorA, factorB: s.factorB, digitType: s.digitType }));
  };

  useEffect(() => { startNewRound(0); }, []);
  if (!setup) return null;

  const { factorA, factorB, product, parts } = setup;
  const allRevealed = revealed >= parts.length;
  const isCorrect = selected === product;

  const revealNext = () => {
    if (revealed >= parts.length) return;
    sounds.click();
    const next = revealed + 1;
    setRevealed(next);
  };

  const revealAll = () => {
    sounds.click();
    setRevealed(parts.length);
  };

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore((s) => s + 1); } else { sounds.wrong(); }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    startNewRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>

      {/* Round header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.76rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {/* Instruction banner */}
      <div style={{
        background: 'rgba(124,92,191,0.14)', border: '1px solid rgba(124,92,191,0.3)',
        borderRadius: 'var(--radius-md)', padding: '8px 14px',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
        textAlign: 'center',
      }}>
        {allRevealed
          ? '✅ All parts multiplied! Now add them up.'
          : `Break apart ${factorA} × ${factorB} by place value!`}
      </div>

      {/* Place-value tiles for factorA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {parts.map((p, i) => (
          <div key={i} style={{
            background: i < revealed ? 'rgba(255,193,7,0.14)' : 'rgba(255,255,255,0.04)',
            border: `2px solid ${i < revealed ? 'rgba(255,193,7,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 'var(--radius-md)', padding: '6px 10px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem',
          }}>
            {p.toLocaleString()}
          </div>
        )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`plus${i}`} style={{ alignSelf: 'center', opacity: 0.5 }}>+</span>, el], [])}
      </div>

      {/* Running list of partial products revealed so far */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
        padding: '10px 12px', minHeight: 56,
      }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
          ✖️ Partial products
        </div>
        <AnimatePresence>
          {parts.slice(0, revealed).map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', padding: '2px 0' }}>
              {p.toLocaleString()} × {factorB} = <strong style={{ color: 'var(--gold)' }}>{(p * factorB).toLocaleString()}</strong>
            </motion.div>
          ))}
        </AnimatePresence>
        {revealed === 0 && (
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Nothing multiplied yet — tap below!</div>
        )}
      </div>

      {/* Reveal buttons */}
      {!allRevealed && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" onClick={revealNext} style={{ flex: 1 }}>
            Multiply Next Part
          </Button>
          <Button variant="outline" size="sm" onClick={revealAll} style={{ flex: 1 }}>
            Multiply All →
          </Button>
        </div>
      )}

      {/* Options (shown after all parts revealed) */}
      {allRevealed && !confirmed && (
        <>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '0.86rem', margin: '2px 0' }}>
            Add up the partial products. What is {factorA} × {factorB}?
          </p>
          <div className="options-grid">
            {options.map((opt) => (
              <button key={opt}
                className={`option-btn${selected === opt ? ' selected' : ''}`}
                onClick={() => setSelected(opt)}>
                {opt.toLocaleString()}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={handleConfirm}
            disabled={!selected} style={{ width: '100%' }}>
            Confirm ✓
          </Button>
        </>
      )}

      {/* Result */}
      {confirmed && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 8,
            background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
            border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '0.88rem', textAlign: 'center',
          }}>
            {isCorrect
              ? `🎉 ${parts.map(p => (p * factorB).toLocaleString()).join(' + ')} = ${product.toLocaleString()} ✓`
              : `❌ It's ${product.toLocaleString()}! ${parts.map(p => (p * factorB).toLocaleString()).join(' + ')} = ${product.toLocaleString()}.`}
          </div>
          <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
            {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
          </Button>
        </motion.div>
      )}

    </div>
  );
}
