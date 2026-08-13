// src/components/simulations/ErrorDetectiveStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const ERROR_SCENARIOS = [
  {
    id: 0,
    problem: "2,314 × 4",
    correctProduct: 9256,
    steps: [
      { text: "Multiply ones: 4 × 4 = 16 (Write 6, carry 1)", isError: false },
      { text: "Multiply tens: 1 × 4 = 4 (Write 4 without adding carry 1) ➔ 46", isError: true },
      { text: "Multiply hundreds & thousands: 3 × 4 = 12, 2 × 4 + 1 = 9 ➔ 9,246", isError: false },
    ],
    diagnoses: [
      { id: 'correct', text: "Forgot to add the carried 1 from the ones column (1 × 4 + 1 = 5, should be 56)", correct: true },
      { id: 'wrong1',  text: "Multiplied 1 × 4 as 5 instead of 4", correct: false },
      { id: 'wrong2',  text: "Added 1 + 4 instead of multiplying", correct: false },
      { id: 'wrong3',  text: "Carried to the wrong place value", correct: false },
    ],
    repairOptions: [9256, 9246, 8256, 9156],
  },
  {
    id: 1,
    problem: "128 × 45",
    correctProduct: 5760,
    steps: [
      { text: "Multiply ones row: 128 × 5 = 640", isError: false },
      { text: "Multiply tens row: 128 × 4 = 512 (Wrote 512 without the shift 0)", isError: true },
      { text: "Add rows: 640 + 512 = 1,152", isError: false },
    ],
    diagnoses: [
      { id: 'correct', text: "Forgot the Shift 0! 4 is in tens place, so 128 × 40 = 5,120", correct: true },
      { id: 'wrong1',  text: "Multiplied 128 × 5 incorrectly in Row 1", correct: false },
      { id: 'wrong2',  text: "Added 640 + 512 with a column carrying error", correct: false },
      { id: 'wrong3',  text: "Subtracted the rows instead of adding", correct: false },
    ],
    repairOptions: [5760, 1152, 5660, 6120],
  },
  {
    id: 2,
    problem: "3,502 × 3",
    correctProduct: 10506,
    steps: [
      { text: "Multiply ones: 2 × 3 = 6 (Write 6)", isError: false },
      { text: "Multiply tens: 0 × 3 = 3 (Wrote 3 in the tens place)", isError: true },
      { text: "Multiply hundreds & thousands: 5 × 3 = 15, 3 × 3 + 1 = 10 ➔ 10,536", isError: false },
    ],
    diagnoses: [
      { id: 'correct', text: "Zero property error: Any number multiplied by 0 equals 0 (0 × 3 = 0, not 3)", correct: true },
      { id: 'wrong1',  text: "Forgot to carry 1 from the ones column", correct: false },
      { id: 'wrong2',  text: "Multiplied 5 × 3 as 16 instead of 15", correct: false },
      { id: 'wrong3',  text: "Added 3 + 0 instead of multiplying", correct: false },
    ],
    repairOptions: [10506, 10536, 10500, 9506],
  },
  {
    id: 3,
    problem: "416 × 23",
    correctProduct: 9568,
    steps: [
      { text: "Multiply ones row: 416 × 3 = 1,248", isError: false },
      { text: "Multiply tens row: 416 × 20 = 8,320", isError: false },
      { text: "Add rows: 1,248 + 8,320 = 9,468 (Added 2+3 as 4 instead of 5)", isError: true },
    ],
    diagnoses: [
      { id: 'correct', text: "Addition error when combining partial products (200 + 300 = 500, not 400)", correct: true },
      { id: 'wrong1',  text: "Forgot the shift 0 in the second partial product", correct: false },
      { id: 'wrong2',  text: "Multiplied 416 × 3 as 1,248 with a carry error", correct: false },
      { id: 'wrong3',  text: "Multiplied 416 × 20 as 8,320 with a zero error", correct: false },
    ],
    repairOptions: [9568, 9468, 9668, 8568],
  },
];

export default function ErrorDetectiveStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stage, setStage] = useState('spot'); // 'spot' -> 'diagnose' -> 'repair' -> 'done'
  const [selectedStep, setSelectedStep] = useState(null);
  const [wrongOpt, setWrongOpt] = useState(null);
  const [success, setSuccess] = useState(false);

  const scenario = ERROR_SCENARIOS[scenarioIdx];

  function handleSelectStep(stepIndex) {
    if (stage !== 'spot') return;
    const step = scenario.steps[stepIndex];
    setSelectedStep(stepIndex);

    if (step.isError) {
      sounds.correct();
      setStage('diagnose');
      setWrongOpt(null);
      narrate([{ text: "Flawed step identified! Now diagnose the mathematical cause.", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setWrongOpt(`step_${stepIndex}`);
      narrate([{ text: "That step is calculated correctly. Inspect the other steps!", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerDiagnosis(diag) {
    if (diag.correct) {
      sounds.levelUp();
      setStage('repair');
      setWrongOpt(null);
      narrate([{ text: "Exact diagnosis! Now calculate the TRUE repaired product.", style: 'statement' }]);
    } else {
      sounds.wrong();
      setWrongOpt(diag.id);
      narrate([{ text: "Review the math carefully to diagnose the exact mistake.", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }

  function handleAnswerRepair(opt) {
    if (opt === scenario.correctProduct) {
      sounds.correct();
      setStage('done');
      setSuccess(true);
      narrate([{ text: "Spot on! Great multiplication!", style: 'statement' }]);
    } else {
      sounds.wrong();
      setWrongOpt(opt);
      narrate([{ text: "Calculate the exact product step-by-step.", style: 'thinking' }]);
      setTimeout(() => setWrongOpt(null), 800);
    }
  }


  function nextScenario() {
    stopAll();
    setScenarioIdx((s) => (s + 1) % ERROR_SCENARIOS.length);
    setStage('spot');
    setSelectedStep(null);
    setWrongOpt(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Error Detective & Fix-It Workshop</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case Problem:</span>
          <span className="station-target-num">{scenario.problem}</span>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Detective Work */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              {stage === 'spot' && 'Step 1: Inspect the student’s work below. Tap the flawed step:'}
              {stage === 'diagnose' && 'Step 2: Why is the marked step mathematically incorrect?'}
              {stage === 'repair' && 'Step 3: Repair the mistake! Calculate the true correct product:'}
              {stage === 'done' && 'Case Cracked! All errors diagnosed and repaired:'}
            </p>

            {/* Steps List */}
            <div className="spot-steps-list">
              {scenario.steps.map((step, idx) => {
                const isSelected = selectedStep === idx;
                const isFlawed = isSelected && step.isError;
                const isWrongSelection = wrongOpt === `step_${idx}`;

                return (
                  <div
                    key={idx}
                    className={`spot-step-card ${isFlawed ? 'selected-error' : ''} ${isWrongSelection ? 'wrong' : ''}`}
                    onClick={() => handleSelectStep(idx)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: stage === 'spot' ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: '1rem', flexShrink: 0 }}>
                        Step {idx + 1}:
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)', color: '#ffffff', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: 1.35 }}>
                        {step.text}
                      </span>
                    </div>
                    {isFlawed && (
                      <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>🎯</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stage 2: Diagnose the Error */}
            {stage === 'diagnose' && (
              <div className="calc-card-box" style={{ borderColor: '#38bdf8' }}>
                <div className="calc-prompt-header">
                  <span>🧠</span>
                  <span>What exact error occurred in Step {selectedStep + 1}?</span>
                </div>
                <div className="carry-decision-grid">
                  {scenario.diagnoses.map((diag) => (
                    <button
                      key={diag.id}
                      className={`carry-decision-btn ${wrongOpt === diag.id ? 'wrong' : ''}`}
                      onClick={() => handleAnswerDiagnosis(diag)}
                    >
                      <span>{diag.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 3: Repair the Product */}
            {stage === 'repair' && (
              <div className="calc-card-box" style={{ borderColor: '#4ade80' }}>
                <div className="calc-prompt-header">
                  <span>🔧</span>
                  <span>Calculate the TRUE product of <strong className="calc-prompt-highlight">{scenario.problem}</strong>:</span>
                </div>
                <div className="calc-options-grid">
                  {scenario.repairOptions.map((opt, i) => (
                    <button
                      key={i}
                      className={`calc-option-btn ${wrongOpt === opt ? 'wrong' : ''}`}
                      onClick={() => handleAnswerRepair(opt)}
                    >
                      {opt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={nextScenario}>Next Case</button>
          </div>
        </div>

        {/* Right Column: Diagnosis & Success State */}
        <div className="station-col-right">
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">🕵️</span>
                <p className="station-success-msg">
                  <strong>Case Cracked!</strong> You diagnosed the error and computed the true solution: <strong>{scenario.correctProduct.toLocaleString()}</strong>!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextScenario}>Try Another Case</button>
                <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                {stage === 'spot' && '👉 Inspect each step on the left. One step contains a common student calculation trap!'}
                {stage === 'diagnose' && '👉 Choose the exact explanation for why this step failed.'}
                {stage === 'repair' && '👉 Calculate the correct final product to complete the repair.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
