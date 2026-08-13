// src/components/simulations/TwoDigitShiftStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { genMultiplication, generateProductDistractors } from '../../core/questions/questionBank.js';

function getNewTarget() {
  const { factorA, factorB, product } = genMultiplication(1, '3x2');
  const onesDigit = factorB % 10;
  const tensDigit = Math.floor(factorB / 10);
  const row1 = factorA * onesDigit;
  const row2 = factorA * (tensDigit * 10);
  const row2Unshifted = factorA * tensDigit;

  const row1Options = generateProductDistractors(row1, { factorA, factorB: onesDigit, digitType: '4x1' });
  const row2Options = [row2, row2Unshifted, row2 * 10, row2 + 100].filter((v, i, a) => a.indexOf(v) === i);
  const sumOptions = generateProductDistractors(product, { factorA, factorB, digitType: '3x2' });

  return { factorA, factorB, product, onesDigit, tensDigit, row1, row2, row2Unshifted, row1Options, row2Options, sumOptions };
}

export default function TwoDigitShiftStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [problem, setProblem] = useState(() => getNewTarget());
  const [stage, setStage] = useState('ones'); // 'ones' -> 'tens_concept' -> 'pull_lever' -> 'tens_calc' -> 'sum' -> 'done'
  const [leverPulled, setLeverPulled] = useState(false);
  const [row1Done, setRow1Done] = useState(false);
  const [row2Done, setRow2Done] = useState(false);
  const [sumDone, setSumDone] = useState(false);
  const [wrongOpt, setWrongOpt] = useState(null);
  const [success, setSuccess] = useState(false);

  const { factorA, factorB, product, onesDigit, tensDigit, row1, row2, row2Unshifted, row1Options, row2Options, sumOptions } = problem;

  function handleAnswerOnes(opt) {
    if (opt === row1) {
      sounds.correct();
      setRow1Done(true);
      setStage('tens_concept');
      setWrongOpt(null);
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerTensConcept(isCorrectChoice) {
    if (isCorrectChoice) {
      sounds.correct();
      setStage('pull_lever');
      setWrongOpt(null);
      narrate([{ text: "Exactly! The tens digit represents tens. Pull the shift lever to place the 0!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setWrongOpt('wrong_concept');
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handlePullLever() {
    sounds.levelUp();
    setLeverPulled(true);
    setStage('tens_calc');
    narrate([{ text: "Shift 0 placed! Now calculate the tens row.", style: 'statement' }]);
  }

  function handleAnswerTens(opt) {
    if (opt === row2) {
      sounds.correct();
      setRow2Done(true);
      setStage('sum');
      setWrongOpt(null);
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerSum(opt) {
    if (opt === product) {
      sounds.correct();
      setSumDone(true);
      setStage('done');
      setSuccess(true);
      narrate([{ text: "Spot on! Great multiplication!", style: 'statement' }]);
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }


  function newProblem() {
    stopAll();
    setProblem(getNewTarget());
    setStage('ones');
    setLeverPulled(false);
    setRow1Done(false);
    setRow2Done(false);
    setSumDone(false);
    setWrongOpt(null);
    setSuccess(false);
  }

  function resetSteps() {
    sounds.click();
    setStage('ones');
    setLeverPulled(false);
    setRow1Done(false);
    setRow2Done(false);
    setSumDone(false);
    setWrongOpt(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🎚️ Station C: 2-Digit Multiplication & Shift 0</h3>
        <div className="station-target-box">
          <span className="station-target-label">Problem:</span>
          <span className="station-target-num">{factorA.toLocaleString()} × {factorB}</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Multi-Step Activity */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              Solve 2-digit multiplication in 3 interactive stages:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Stage 1: Ones Row */}
              {stage === 'ones' && (
                <div className="calc-card-box">
                  <div className="calc-prompt-header">
                    <span>⚡</span>
                    <span>
                      Phase 1 (Ones Row): Calculate <strong className="calc-prompt-highlight">{factorA} × {onesDigit}</strong> = ?
                    </span>
                  </div>
                  <div className="calc-options-grid">
                    {row1Options?.map((opt, i) => (
                      <button
                        key={i}
                        className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                        onClick={() => handleAnswerOnes(opt)}
                      >
                        {opt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 2A: Conceptual Understanding of Tens */}
              {stage === 'tens_concept' && (
                <div className="calc-card-box" style={{ borderColor: '#38bdf8' }}>
                  <div className="calc-prompt-header">
                    <span>💡</span>
                    <span>
                      In <strong className="calc-prompt-highlight">{factorB}</strong>, what value does the digit <strong className="calc-prompt-highlight">{tensDigit}</strong> represent?
                    </span>
                  </div>
                  <div className="carry-decision-grid">
                    <button
                      className={`carry-decision-btn ${wrongOpt === 'wrong_concept' ? 'wrong' : ''}`}
                      onClick={() => handleAnswerTensConcept(true)}
                    >
                      <span>🚀 {tensDigit} Tens ({tensDigit * 10})</span>
                    </button>
                    <button
                      className="carry-decision-btn"
                      onClick={() => handleAnswerTensConcept(false)}
                    >
                      <span>🧁 {tensDigit} Ones ({tensDigit})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 2B: Pull the Shift Lever */}
              {stage === 'pull_lever' && (
                <div className="calc-card-box" style={{ borderColor: '#ef4444' }}>
                  <div className="calc-prompt-header">
                    <span>🕹️</span>
                    <span>Because we multiply by {tensDigit * 10}, pull the lever to insert the Shift 0:</span>
                  </div>
                  <button
                    className="calc-option-btn"
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', fontSize: '1.05rem' }}
                    onClick={handlePullLever}
                  >
                    🚀 Pull Shift Lever (Place 0)
                  </button>
                </div>
              )}

              {/* Stage 2C: Calculate Tens Row with 0 */}
              {stage === 'tens_calc' && (
                <div className="calc-card-box" style={{ borderColor: '#ef4444' }}>
                  <div className="calc-prompt-header">
                    <span>🚀</span>
                    <span>
                      Since {factorA} × {tensDigit} = {row2Unshifted}, what is <strong className="calc-prompt-highlight">{factorA} × {tensDigit * 10}</strong>?
                    </span>
                  </div>
                  <div className="calc-options-grid">
                    {row2Options?.map((opt, i) => (
                      <button
                        key={i}
                        className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                        onClick={() => handleAnswerTens(opt)}
                      >
                        {opt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 3: Sum the Two Rows */}
              {stage === 'sum' && (
                <div className="calc-card-box" style={{ borderColor: '#4ade80' }}>
                  <div className="calc-prompt-header">
                    <span>➕</span>
                    <span>
                      Add partial rows: <strong className="calc-prompt-highlight">{row1.toLocaleString()} + {row2.toLocaleString()}</strong> = ?
                    </span>
                  </div>
                  <div className="calc-options-grid">
                    {sumOptions?.map((opt, i) => (
                      <button
                        key={i}
                        className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                        onClick={() => handleAnswerSum(opt)}
                      >
                        {opt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={newProblem}>New Problem</button>
            <button className="btn-outline" onClick={resetSteps}>Reset Steps</button>
          </div>
        </div>

        {/* Right Column: 2-Digit Algorithm Table & Success Card */}
        <div className="station-col-right">
          {/* Running Calculation Bar */}
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', color: '#ffffff' }}>
              Row 1 ({row1Done ? row1.toLocaleString() : '?'}) + Row 2 ({row2Done ? row2.toLocaleString() : '?'})
            </div>
            <div className="running-ratio-text">
              Total Product = {sumDone ? product.toLocaleString() : '?'}
            </div>
          </div>

          {/* Vertical 2-Digit Algorithm Table */}
          <div className="shift-algorithm-table">
            <div className="shift-factor-line">
              <span>{factorA}</span>
            </div>
            <div className="shift-factor-line">
              <span className="op">×</span>
              <span>{factorB}</span>
            </div>

            <div style={{ width: '100%', height: '2px', background: 'rgba(255, 255, 255, 0.4)', margin: '4px 0' }} />

            {/* Row 1 */}
            <div className="shift-row-display">
              <span className="shift-row-label">Row 1 (×{onesDigit})</span>
              <span style={{ color: row1Done ? '#ffffff' : 'rgba(255,255,255,0.2)' }}>
                {row1Done ? row1.toLocaleString() : '----'}
              </span>
            </div>

            {/* Row 2 */}
            <div className="shift-row-display">
              <span className="shift-row-label">Row 2 (×{tensDigit}0)</span>
              {row2Done ? (
                <span>
                  {row2Unshifted}<span className="shift-zero-box">0</span>
                </span>
              ) : leverPulled ? (
                <span>
                  ---<span className="shift-zero-box">0</span>
                </span>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>----</span>
              )}
            </div>

            <div style={{ width: '100%', height: '2px', background: 'rgba(255, 255, 255, 0.4)', margin: '4px 0' }} />

            {/* Total Row */}
            <div className="shift-row-display">
              <span className="shift-row-label" style={{ color: 'var(--gold)' }}>Total Product</span>
              <span style={{ color: sumDone ? '#4ade80' : 'rgba(255,255,255,0.2)', fontSize: '1.6rem' }}>
                {sumDone ? product.toLocaleString() : '----'}
              </span>
            </div>
          </div>

          {/* Success / Guide State */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  2-Digit multiplication mastered! <strong>{row1.toLocaleString()} + {row2.toLocaleString()} = {product.toLocaleString()}</strong>!
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
                {stage === 'ones' && `Calculate the ones row on the left (${factorA} × ${onesDigit}).`}
                {stage === 'tens_concept' && `Identify the place value of ${tensDigit} in ${factorB}.`}
                {stage === 'pull_lever' && `Pull the Rocket Lever to place the crucial Shift 0.`}
                {stage === 'tens_calc' && `Calculate the full tens row (${factorA} × ${tensDigit * 10}).`}
                {stage === 'sum' && `Add both partial rows together.`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

