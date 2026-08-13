// src/components/shared/FloatingNumbers.jsx
import React, { useMemo } from 'react';
import './FloatingNumbers.css';

const SYMBOLS = ['✖️', '➗', '4×1', '3×2', '⭐', '💡', '✨', '🔢', '2,314', '128', '45', '9,256'];

export default function FloatingNumbers() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      left: `${(i * 5.6 + (i % 3) * 7) % 94}%`,
      top: `${(i * 7.8 + (i % 4) * 9) % 90}%`,
      delay: `${(i * 0.45) % 4}s`,
      dur: `${5.5 + (i % 3) * 1.5}s`,
      size: `${0.95 + (i % 3) * 0.35}rem`,
      opacity: 0.12 + (i % 3) * 0.08,
    }));
  }, []);

  return (
    <div className="floating-bg" aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.id}
          className="float-sym"
          style={{
            left: it.left,
            top: it.top,
            animationDelay: it.delay,
            animationDuration: it.dur,
            fontSize: it.size,
            opacity: it.opacity,
          }}
        >
          {it.symbol}
        </span>
      ))}
    </div>
  );
}
