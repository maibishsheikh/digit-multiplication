// src/components/simulations/RegroupMachineStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { genMultiplication, generateProductDistractors } from '../../core/questions/questionBank.js';

const COL_NAMES = ['Ones', 'Tens', 'Hundreds', 'Thousands'];

function getNewTarget() {
  const { factorA, factorB, product } = genMultiplication(1, '4x1');
  const digits = String(factorA).split('').map(Number);

  // Pre-calculate all column steps with smart distractors
  const steps = [];
  let carry = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    const d = digits[i];
    const rawProd = d * factorB;
    const total = rawProd + carry;
    const writeDigit = total % 10;
    const nextCarry = Math.floor(total / 10);
    const colIdx = digits.length - 1 - i;

    // Distractors for calculation step
    const multOptions = generateProductDistractors(total, { factorA: d, factorB, digitType: '4x1' });

    // Carry choices
    const carryChoices = [
      { id: 'correct', text: `✍️ Write ${writeDigit}, 🚀 Carry +${nextCarry}`, correct: true },
      { id: 'invert',  text: `✍️ Write ${nextCarry}, 🚀 Carry +${writeDigit}`, correct: false },
      { id: 'no_carry',text: `✍️ Write ${writeDigit}, 🚀 No carry (0)`,       correct: false },
    ];
    if (nextCarry === 0) {
      carryChoices[1] = { id: 'fake_carry', text: `✍️ Write ${writeDigit}, 🚀 Carry +1`, correct: false };
    }

    steps.push({
      colName: COL_NAMES[colIdx] || `Col ${colIdx + 1}`,
      digit: d,
      rawProd,
      carryIn: carry,
      total,
      writeDigit,
      carryOut: nextCarry,
      colIndexFromRight: colIdx,
      multOptions,
      carryChoices: carryChoices.filter((v, idx, a) => a.findIndex(t => t.text === v.text) === idx),
    });
    carry = nextCarry;
  }

  // Final carry step if needed
  if (carry > 0) {
    steps.push({
      colName: COL_NAMES[digits.length] || 'Ten-Thousands',
      digit: 0,
      rawProd: 0,
      carryIn: carry,
      total: carry,
      writeDigit: carry,
      carryOut: 0,
      colIndexFromRight: digits.length,
      multOptions: [carry, carry + 1, carry + 2, carry * 2].filter((v, idx, a) => a.indexOf(v) === idx),
      carryChoices: [{ id: 'correct', text: `✍️ Write ${carry}`, correct: true }],
    });
  }

  return { factorA, factorB, product, digits, steps };
}

export default function RegroupMachineStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [problem, setProblem] = useState(() => getNewTarget());
  const [stepIdx, setStepIdx] = useState(0);
  const [subStage, setSubStage] = useState('mult'); // 'mult' -> 'carry' -> next column
  const [wrongOpt, setWrongOpt] = useState(null);
  const [success, setSuccess] = useState(false);

  const { factorA, factorB, product, digits, steps } = problem;
  const currentStep = steps[stepIdx];
  const isComplete = stepIdx >= steps.length;

  function handleAnswerMult(opt) {
    if (!currentStep) return;
    if (opt === currentStep.total) {
      sounds.correct();
      setWrongOpt(null);
      if (currentStep.carryChoices.length > 1) {
        setSubStage('carry');
      } else {
        advanceColumn();
      }
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      narrate([{ text: "Check your calculation and try again.", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerCarry(choice) {
    if (choice.correct) {
      sounds.levelUp();
      setWrongOpt(null);
      advanceColumn();
    } else {
      sounds.wrong();
      setWrongOpt(choice.id);
      narrate([{ text: "Remember: write the ones digit in the answer and carry the tens digit!", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function advanceColumn() {
    const nextIdx = stepIdx + 1;
    setStepIdx(nextIdx);
    setSubStage('mult');

    if (nextIdx >= steps.length) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: "Spot on! Great multiplication!", style: 'statement' }]);
    }
  }


  function resetSteps() {
    sounds.click();
    setStepIdx(0);
    setSubStage('mult');
    setWrongOpt(null);
    setSuccess(false);
  }

  function newProblem() {
    stopAll();
    setProblem(getNewTarget());
    setStepIdx(0);
    setSubStage('mult');
    setWrongOpt(null);
    setSuccess(false);
  }

  // Calculate result digits for chalkboard
  const writtenDigits = [];
  const currentCarries = {};
  for (let i = 0; i < stepIdx; i++) {
    const s = steps[i];
    writtenDigits.unshift(s.writeDigit);
    if (s.carryOut > 0 && i + 1 < steps.length) {
      currentCarries[i + 1] = s.carryOut;
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🔢 Station B: Column Algorithm & Regrouping</h3>
        <div className="station-target-box">
          <span className="station-target-label">Standard Algorithm:</span>
          <span className="station-target-num">{factorA.toLocaleString()} × {factorB}</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Step Guidance & Student Choices */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              {!isComplete
                ? `Active Focus: Step ${stepIdx + 1} (${currentStep?.colName} Column). Calculate each step:`
                : 'All columns completed! Verify the final product on the chalkboard:'}
            </p>

            {!isComplete && currentStep && (
              <div className="calc-card-box">
                {/* Stage 1: Multiply Digit & Add Carry */}
                {subStage === 'mult' && (
                  <>
                    <div className="calc-prompt-header">
                      <span>🧠</span>
                      <span>
                        Calculate {currentStep.colName}:&nbsp;
                        <strong className="calc-prompt-highlight">
                          ({currentStep.digit} × {factorB})
                          {currentStep.carryIn > 0 && ` + ${currentStep.carryIn} carry`}
                        </strong> = ?
                      </span>
                    </div>

                    <div className="calc-options-grid">
                      {currentStep.multOptions?.map((opt, i) => (
                        <button
                          key={i}
                          className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                          onClick={() => handleAnswerMult(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Stage 2: Regrouping Decision (Write vs. Carry) */}
                {subStage === 'carry' && (
                  <>
                    <div className="calc-prompt-header">
                      <span>✍️</span>
                      <span>
                        Product is <strong className="calc-prompt-highlight">{currentStep.total}</strong>. How do we record this?
                      </span>
                    </div>

                    <div className="carry-decision-grid">
                      {currentStep.carryChoices?.map((choice) => (
                        <button
                          key={choice.id}
                          className={`carry-decision-btn ${wrongOpt === choice.id ? 'wrong' : ''}`}
                          onClick={() => handleAnswerCarry(choice)}
                        >
                          <span>{choice.text}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={newProblem}>New Problem</button>
            <button className="btn-outline" onClick={resetSteps}>Reset Steps</button>
          </div>
        </div>

        {/* Right Column: Chalkboard Display, Running Calculation & Success Card */}
        <div className="station-col-right">
          {/* Running Calculation Bar */}
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', color: '#ffffff' }}>
              {stepIdx > 0 ? (
                <span>
                  Result so far: <strong style={{ color: '#4ade80' }}>{writtenDigits.join('') || '0'}</strong>
                </span>
              ) : (
                <span>Start by calculating the ones column on the left!</span>
              )}
            </div>
            <div className="running-ratio-text">
              Total Product = {isComplete ? product.toLocaleString() : '?'}
            </div>
          </div>

          {/* Digital Chalkboard Calculation */}
          <div className="chalkboard-calc-box">
            <div className="chalk-columns-header">
              <span></span>
              <span>Th</span>
              <span>H</span>
              <span>T</span>
              <span>O</span>
            </div>

            <div className="chalk-grid-math">
              {/* Carry Row */}
              <div className="chalk-cell"></div>
              {[3, 2, 1, 0].map((col) => (
                <div key={col} className="chalk-cell">
                  {currentCarries[col] ? (
                    <span className="chalk-carry-bubble">+{currentCarries[col]}</span>
                  ) : null}
                </div>
              ))}

              {/* Factor A Row */}
              <div className="chalk-cell"></div>
              {digits.map((d, i) => {
                const colIdxFromRight = digits.length - 1 - i;
                const isActive = !isComplete && currentStep?.colIndexFromRight === colIdxFromRight;
                return (
                  <div key={i} className={`chalk-cell ${isActive ? 'active-col' : ''}`}>
                    {d}
                  </div>
                );
              })}

              {/* Factor B Row */}
              <div className="chalk-cell" style={{ color: 'var(--gold)' }}>×</div>
              <div className="chalk-cell"></div>
              <div className="chalk-cell"></div>
              <div className="chalk-cell"></div>
              <div className="chalk-cell" style={{ color: 'var(--gold)' }}>{factorB}</div>

              {/* Divider */}
              <div className="chalk-divider"></div>

              {/* Result Row */}
              <div className="chalk-cell"></div>
              {[3, 2, 1, 0].map((col) => {
                const s = steps.find((st) => st.colIndexFromRight === col);
                const isRevealed = s && stepIdx > steps.indexOf(s);
                return (
                  <div key={col} className="chalk-cell">
                    {isRevealed ? (
                      <span className="chalk-res-digit">{s.writeDigit}</span>
                    ) : (
                      <span className="chalk-res-digit blank">_</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success / Guide State */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Standard algorithm mastered! <strong>{factorA.toLocaleString()} × {factorB} = {product.toLocaleString()}</strong>!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newProblem}>Try Another</button>
                <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                {subStage === 'mult' && `Calculate ${currentStep?.colName} column on the left.`}
                {subStage === 'carry' && `Decide which digit to write in the answer and which to carry.`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

