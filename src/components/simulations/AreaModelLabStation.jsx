// src/components/simulations/AreaModelLabStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { genMultiplication, placeValueParts, generateProductDistractors } from '../../core/questions/questionBank.js';

const PLACE_THEMES = [
  { label: 'Thousands', icon: '🏢', color: '#818cf8', gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
  { label: 'Hundreds',  icon: '📦', color: '#38bdf8', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' },
  { label: 'Tens',      icon: '🥖', color: '#34d399', gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { label: 'Ones',      icon: '🧁', color: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
];

function getPlaceTheme(val) {
  if (val >= 1000) return PLACE_THEMES[0];
  if (val >= 100)  return PLACE_THEMES[1];
  if (val >= 10)   return PLACE_THEMES[2];
  return PLACE_THEMES[3];
}

function getNewTarget() {
  const { factorA, factorB, product } = genMultiplication(1, '4x1');
  const parts = placeValueParts(factorA);

  // Generate options for each place value piece
  const tileOptions = {};
  parts.forEach((p) => {
    tileOptions[p] = generateProductDistractors(p * factorB, { factorA: p, factorB, digitType: '4x1' });
  });

  // Generate options for total sum
  const sumOptions = generateProductDistractors(product, { factorA, factorB, digitType: '4x1' });

  return { factorA, factorB, product, parts, tileOptions, sumOptions };
}

export default function AreaModelLabStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [problem, setProblem] = useState(() => getNewTarget());
  const [activeTile, setActiveTile] = useState(null); // which tile is currently being calculated
  const [revealed, setRevealed] = useState({});
  const [sumSolved, setSumSolved] = useState(false);
  const [wrongOpt, setWrongOpt] = useState(null);
  const [success, setSuccess] = useState(false);

  const { factorA, factorB, product, parts, tileOptions, sumOptions } = problem;
  const allTilesSolved = parts.every((p) => revealed[p]);

  function handleSelectTile(p) {
    if (revealed[p]) return;
    setActiveTile(p);
    setWrongOpt(null);
    sounds.click();
    const theme = getPlaceTheme(p);
    narrate([{ text: `Calculate the ${theme.label} piece: ${p.toLocaleString()} × ${factorB}.`, style: 'instruction' }]);
  }

  function handleAnswerTile(opt) {
    if (!activeTile) return;
    const correctVal = activeTile * factorB;
    if (opt === correctVal) {
      sounds.correct();
      const nextRev = { ...revealed, [activeTile]: true };
      setRevealed(nextRev);
      setActiveTile(null);
      setWrongOpt(null);

      if (parts.every((p) => nextRev[p])) {
        narrate([{ text: "Great! All partial products found. Now add them together!", style: 'celebration' }]);
      } else {
        sounds.correct();
      }
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerSum(opt) {
    if (opt === product) {
      sounds.correct();
      setSumSolved(true);
      setSuccess(true);
      narrate([{ text: "Great! All partial products found. Now add them together!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      narrate([{ text: "Check your addition of the partial products and try again.", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }


  function newProblem() {
    stopAll();
    setProblem(getNewTarget());
    setActiveTile(null);
    setRevealed({});
    setSumSolved(false);
    setWrongOpt(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🧩 Station A: Area Model & Partial Products</h3>
        <div className="station-target-box">
          <span className="station-target-label">Multiplication:</span>
          <span className="station-target-num">{factorA.toLocaleString()} × {factorB}</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Tile Challenges & Student Calculations */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              {!allTilesSolved
                ? 'Tap each place-value tile to calculate its partial product with your brain:'
                : 'All partial products calculated! Now add them up to find the total product:'}
            </p>

            {/* Place-Value Tiles List */}
            <div className="tile-supply-list">
              {parts.map((p, idx) => {
                const theme = getPlaceTheme(p);
                const isRev = !!revealed[p];
                const isCurrentActive = activeTile === p;
                const partialVal = p * factorB;

                return (
                  <div key={idx} className="tile-supply-item" style={{ borderColor: isCurrentActive ? 'var(--gold)' : undefined }}>
                    <button
                      className="tile-btn"
                      style={{ background: theme.gradient }}
                      onClick={() => handleSelectTile(p)}
                      disabled={isRev}
                      aria-label={`Multiply ${theme.label} ${p} by ${factorB}`}
                    >
                      <div className="tile-btn-info">
                        <span className="tile-icon">{theme.icon}</span>
                        <span className="tile-label">{theme.label} ({p.toLocaleString()} × {factorB})</span>
                      </div>
                      <span className="tile-count-pill">
                        {isRev ? `= ${partialVal.toLocaleString()} ✓` : isCurrentActive ? 'Calculating...' : '🧠 Tap to Solve'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Calculation Card for Current Tile */}
            {activeTile && !revealed[activeTile] && (
              <div className="calc-card-box">
                <div className="calc-prompt-header">
                  <span>🧠</span>
                  <span>Calculate: <strong className="calc-prompt-highlight">{activeTile.toLocaleString()} × {factorB}</strong> = ?</span>
                </div>
                <div className="calc-options-grid">
                  {tileOptions[activeTile]?.map((opt, i) => (
                    <button
                      key={i}
                      className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                      onClick={() => handleAnswerTile(opt)}
                    >
                      {opt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Final Summation Card once all 4 tiles are solved */}
            {allTilesSolved && !sumSolved && (
              <div className="calc-card-box" style={{ borderColor: '#4ade80' }}>
                <div className="calc-prompt-header">
                  <span>📥</span>
                  <span>Add partials: <strong>{parts.map(p => (p * factorB).toLocaleString()).join(' + ')}</strong> = ?</span>
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

          <div className="station-actions">
            <button className="btn-outline" onClick={newProblem}>New Problem</button>
          </div>
        </div>

        {/* Right Column: Visual Area Model, Running Calculation & Success Card */}
        <div className="station-col-right">
          {/* Running Calculation Bar */}
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.98rem, 1.2vw, 1.15rem)', color: '#ffffff' }}>
              {parts.map((p, idx) => (
                <span key={idx}>
                  {idx > 0 && ' + '}
                  <span style={{ color: revealed[p] ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
                    {revealed[p] ? (p * factorB).toLocaleString() : `(${p}×${factorB})`}
                  </span>
                </span>
              ))}
            </div>
            <div className="running-ratio-text">
              Total Product = {sumSolved ? product.toLocaleString() : '?'}
            </div>
          </div>

          {/* Visual Area Model Grid */}
          <div className="area-model-visual-box">
            {parts.map((p, idx) => {
              const theme = getPlaceTheme(p);
              const isRev = !!revealed[p];
              return (
                <div key={idx} className={`area-model-cell ${isRev ? 'revealed' : ''}`}>
                  <span className="cell-place-tag">{theme.label}</span>
                  <span className="cell-chunk-num">{p.toLocaleString()}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>× {factorB}</span>
                  {isRev ? (
                    <span className="cell-prod-num">= {(p * factorB).toLocaleString()}</span>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>?</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Success / Guide State */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Awesome job! You decomposed <strong>{factorA.toLocaleString()}</strong>, multiplied each piece, and calculated <strong>{product.toLocaleString()}</strong>!
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
                {!activeTile && !allTilesSolved && '👉 Tap an unrevealed tile on the left to start calculating!'}
                {activeTile && !revealed[activeTile] && `Select the correct answer for ${activeTile.toLocaleString()} × ${factorB}.`}
                {allTilesSolved && !sumSolved && 'Now select the correct total sum of all partial products.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



