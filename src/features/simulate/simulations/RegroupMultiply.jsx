// src/features/simulate/simulations/RegroupMultiply.jsx
//
// Learning goal: see the STANDARD ALGORITHM for multi-digit multiplication,
// including regrouping (carrying).
// Three-phase flow per round:
//   1. KNOW IT    — see the multiplication problem set up vertically
//   2. REGROUP IT — reveal each algorithm step one at a time, then answer
//   3. REVEAL     — see the fully worked solution with every step labelled
//
// Every step is computed live in JS (see getCarrySteps / getTwoRowSteps),
// so the regrouping shown is always mathematically exact.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { sounds } from '../../../utils/audio.js';
import { genMultiplication, generateProductDistractors } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;

// 4-digit × 1-digit: multiply each digit right-to-left, carrying into the next place
function getCarrySteps(factorA, factorB) {
  const digits = String(factorA).split('').map(Number).reverse();
  let carry = 0;
  const steps = [];
  const resultDigits = [];
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    const raw = d * factorB + carry;
    const writeDigit = raw % 10;
    const newCarry = Math.floor(raw / 10);
    let text = `${d} × ${factorB}`;
    if (carry > 0) text += ` + ${carry} carried`;
    text += ` = ${raw} → write ${writeDigit}`;
    if (newCarry > 0) text += `, carry ${newCarry}`;
    steps.push(text);
    resultDigits.push(writeDigit);
    carry = newCarry;
  }
  if (carry > 0) { steps.push(`Write the final carry: ${carry}`); resultDigits.push(carry); }
  const result = parseInt(resultDigits.reverse().join(''), 10);
  return { steps, result };
}

// 3-digit × 2-digit: multiply by ones digit, then tens digit (shifted), then add
function getTwoRowSteps(factorA, factorB) {
  const ones = factorB % 10;
  const tens = Math.floor(factorB / 10);
  const row1 = factorA * ones;
  const row2 = factorA * tens;
  const row2Shifted = row2 * 10;
  const total = row1 + row2Shifted;
  const steps = [
    `Multiply ${factorA} × ${ones} (ones digit) = ${row1}`,
    `Multiply ${factorA} × ${tens} (tens digit) = ${row2}, shift one place left → ${row2Shifted}`,
    `Add the two rows: ${row1} + ${row2Shifted} = ${total}`,
  ];
  return { steps, result: total };
}

function genRound(roundIdx) {
  const forceType = roundIdx % 2 === 0 ? '4x1' : '3x2';
  const { digitType, factorA, factorB, product } = genMultiplication(1, forceType); // kid-friendly numbers for Simulate
  const { steps } = digitType === '4x1' ? getCarrySteps(factorA, factorB) : getTwoRowSteps(factorA, factorB);
  const options = generateProductDistractors(product, { factorA, factorB, digitType });
  return { digitType, factorA, factorB, product, steps, options };
}

function VerticalSetup({ factorA, factorB }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(74,144,217,0.22), rgba(124,92,191,0.22))',
      border: '2px solid rgba(74,144,217,0.45)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      textAlign: 'right',
      fontFamily: 'var(--font-display)', fontWeight: 800,
      fontSize: '1.7rem', color: '#fff', letterSpacing: '0.04em',
    }}>
      <div>{factorA.toLocaleString()}</div>
      <div>×&nbsp;{factorB.toLocaleString()}</div>
      <div style={{ borderTop: '3px solid rgba(255,255,255,0.5)', marginTop: 6, paddingTop: 6, minHeight: 34 }}>?</div>
    </div>
  );
}

export default function RegroupMultiply({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [step, setStep]           = useState('know');   // 'know' | 'regroup' | 'reveal'
  const [stepsShown, setStepsShown] = useState(0);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = (idx) => {
    setSetup(genRound(idx));
    setStep('know');
    setStepsShown(0);
    setSelected(null);
    setConfirmed(false);
  };

  useEffect(() => { newRound(0); }, []);
  if (!setup) return null;

  const isCorrect = selected === setup.product;
  const allStepsShown = stepsShown >= setup.steps.length;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore((s) => s + 1); } else { sounds.wrong(); }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    newRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10 }}>

      {/* Round header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.76rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {/* STEP 1: KNOW IT */}
      {step === 'know' && (
        <AnimatePresence mode="wait">
          <motion.div key="know" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)' }}>
              🦊 Here&apos;s the problem, set up vertically:
            </div>
            <VerticalSetup factorA={setup.factorA} factorB={setup.factorB} />
            <Button variant="primary" size="sm" onClick={() => setStep('regroup')} style={{ width: '100%' }}>
              Multiply & regroup 🔢
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* STEP 2: REGROUP IT */}
      {step === 'regroup' && (
        <AnimatePresence mode="wait">
          <motion.div key="regroup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            <div style={{
              background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)',
              borderRadius: 'var(--radius-md)', padding: '7px 14px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.55)', textAlign: 'center',
            }}>
              ✖️ {setup.factorA.toLocaleString()} × {setup.factorB.toLocaleString()}
            </div>

            {/* Step-by-step regrouping log */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
              padding: '10px 12px', minHeight: 70,
            }}>
              <AnimatePresence>
                {setup.steps.slice(0, stepsShown).map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', padding: '3px 0' }}>
                    {i + 1}. {s}
                  </motion.div>
                ))}
              </AnimatePresence>
              {stepsShown === 0 && (
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Tap below to reveal each step!</div>
              )}
            </div>

            {!allStepsShown && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" onClick={() => setStepsShown((n) => n + 1)} style={{ flex: 1 }}>
                  Show Next Step
                </Button>
                <Button variant="outline" size="sm" onClick={() => setStepsShown(setup.steps.length)} style={{ flex: 1 }}>
                  Show All →
                </Button>
              </div>
            )}

            {allStepsShown && (
              <>
                <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
                  fontWeight: 700, fontSize: '0.88rem', margin: '2px 0' }}>
                  So what is {setup.factorA.toLocaleString()} × {setup.factorB.toLocaleString()}?
                </p>
                <div className="options-grid">
                  {setup.options.map((opt) => (
                    <button key={opt}
                      className={`option-btn${
                        confirmed
                          ? opt === setup.product ? ' correct' : opt === selected ? ' wrong' : ' disabled'
                          : selected === opt ? ' selected' : ''
                      }`}
                      onClick={() => { if (!confirmed) setSelected(opt); }}
                      disabled={confirmed}>
                      {opt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {!confirmed && (
                  <Button variant="primary" size="sm" onClick={handleConfirm} disabled={!selected} style={{ width: '100%' }}>
                    Check ✓
                  </Button>
                )}

                {confirmed && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{
                      padding: '9px 14px', borderRadius: 'var(--radius-md)', marginBottom: 8,
                      background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
                      border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '0.88rem', textAlign: 'center',
                    }}>
                      {isCorrect ? `🎉 Correct! ${setup.factorA.toLocaleString()} × ${setup.factorB.toLocaleString()} = ${setup.product.toLocaleString()}` : `❌ Answer: ${setup.product.toLocaleString()}`}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep('reveal')} style={{ width: '100%' }}>
                      See full solution 🧩
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* STEP 3: REVEAL */}
      {step === 'reveal' && (
        <AnimatePresence mode="wait">
          <motion.div key="reveal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)' }}>
              🦊 The full worked solution:
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px',
            }}>
              {setup.steps.map((s, i) => (
                <div key={i} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
                  padding: '4px 0', borderBottom: i < setup.steps.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  {i + 1}. {s}
                </div>
              ))}
              <div style={{
                marginTop: 8, fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '1.15rem', color: 'var(--gold)', textAlign: 'center',
              }}>
                {setup.factorA.toLocaleString()} × {setup.factorB.toLocaleString()} = {setup.product.toLocaleString()} ✓
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
