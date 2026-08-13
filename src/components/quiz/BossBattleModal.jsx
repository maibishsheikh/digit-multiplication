// src/components/quiz/BossBattleModal.jsx
import React, { useState } from 'react';
import './BossBattleModal.css';
import QuestionRenderer from './QuestionRenderer.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { bossStartNarration, bossWinNarration } from '../../utils/narration.js';

export default function BossBattleModal({ boss, questions = [], onWin, onClose, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const battleQuestions = questions.length > 0 ? questions : [];
  const question = battleQuestions[qIndex];

  function startBattle() {
    setStarted(true);
    narrate(bossStartNarration(boss.name));
  }

  function handleAnswer(ans) {
    if (!question) return;
    const isCorrect = String(ans).trim() === String(question.correctAnswer).trim();
    if (isCorrect) {
      sounds.correct();
      if (qIndex + 1 >= battleQuestions.length) {
        setWon(true);
        sounds.badge();
        narrate(bossWinNarration(boss.reward));
      } else {
        setQIndex(qIndex + 1);
      }
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setLost(true);
        sounds.defeat();
      }
    }
  }

  if (!started) {
    return (
      <div className="boss-modal-backdrop" onClick={onClose}>
        <div className="boss-modal-card glass-card anim-bounce-in" onClick={e => e.stopPropagation()}>
          <div className="boss-avatar-pulse">
            <span className="boss-emoji">{boss.emoji}</span>
          </div>
          <h2 className="boss-title">{boss.name}</h2>
          <p className="boss-desc">
            Answer {battleQuestions.length} multiplication problems correctly to defeat the boss!
          </p>
          <div className="boss-lives-preview">
            Lives: {'❤️'.repeat(3)}
          </div>
          <div className="boss-reward-preview">
            Reward: <strong>{boss.reward}</strong> (+50 XP)
          </div>
          <div className="boss-actions">
            <button className="btn-primary" onClick={startBattle}>
              ⚔️ Begin Boss Battle!
            </button>
            <button className="btn-outline" onClick={onClose}>
              Back to District
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="boss-modal-backdrop" onClick={onWin}>
        <div className="boss-modal-card glass-card anim-bounce-in" onClick={e => e.stopPropagation()}>
          <div className="boss-avatar-pulse" style={{ background: 'rgba(76, 175, 80, 0.4)' }}>
            <span className="boss-emoji">🏆</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--green-bright)' }}>Boss Defeated!</h2>
          <p className="boss-desc">
            You conquered {boss.name} and claimed the <strong>{boss.reward}</strong>!
          </p>
          <button className="btn-green" onClick={onWin}>
            Claim Reward & Continue ✨
          </button>
        </div>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="boss-modal-backdrop" onClick={onClose}>
        <div className="boss-modal-card glass-card anim-shake" onClick={e => e.stopPropagation()}>
          <div className="boss-avatar-pulse" style={{ background: 'rgba(239, 83, 80, 0.4)' }}>
            <span className="boss-emoji">💔</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--red-light)' }}>Out of Lives!</h2>
          <p className="boss-desc">
            {boss.name} was too strong! Review the multiplication methods and challenge again.
          </p>
          <button className="btn-primary" onClick={onClose}>
            Return to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="boss-modal-backdrop">
      <div className="boss-modal-card battle-mode glass-card anim-slide-up">
        {/* Boss HUD */}
        <div className="boss-hud">
          <div className="boss-hud-left">
            <span className="boss-hud-emoji">{boss.emoji}</span>
            <span className="boss-hud-name">{boss.name}</span>
          </div>
          <div className="boss-hud-lives">
            {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
          </div>
          <div className="boss-hud-progress">
            {qIndex + 1}/{battleQuestions.length}
          </div>
        </div>

        {/* Question Area */}
        {question && (
          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={2}
            showHint={false}
            onHint={() => {}}
            isLocked={false}
          />
        )}
      </div>
    </div>
  );
}
