// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import { DISTRICTS } from '../../data/questionBank.js';
import { calcStars } from '../../utils/scoring.js';

export default function KingdomMap({ districtScores = [], districtCorrect = [], currentDistrict = 0, onSelectDistrict }) {
  return (
    <div className="kingdom-map-grid">
      {DISTRICTS.map((d, idx) => {
        const isCurrent   = idx === currentDistrict;
        const isUnlocked  = idx <= currentDistrict;
        const score       = districtScores[idx];
        const correct     = districtCorrect[idx] || 0;
        const stars       = score !== null ? calcStars(score) : 0;
        const isCompleted = score !== null;

        let statusClass = 'locked';
        if (isCompleted) statusClass = 'completed';
        else if (isCurrent) statusClass = 'active';
        else if (isUnlocked) statusClass = 'unlocked';

        return (
          <div
            key={d.id}
            className={`district-card ${statusClass}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
            style={{ '--dist-accent': d.accent }}
          >
            {/* World Badge */}
            <div className="district-num-badge">
              <span>W{idx + 1}</span>
            </div>

            {/* Icon */}
            <div className="district-icon-wrap">
              <span className="district-icon">{d.icon}</span>
            </div>

            {/* Title */}
            <div className="district-name">{d.name}</div>

            {/* Stars / Progress */}
            {isCompleted ? (
              <div className="district-stars">
                {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                <span className="district-score-text">({correct}/10)</span>
              </div>
            ) : isCurrent ? (
              <div className="district-current-tag">⚡ Current World</div>
            ) : (
              <div className="district-locked-tag">🔒 Locked</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
