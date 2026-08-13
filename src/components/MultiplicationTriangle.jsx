// src/components/MultiplicationTriangle.jsx
// Topic-adapted equivalent of the equal-groups reference's FactFamilyTriangle.
// Same SVG structure and prop contract, relabelled for multiplication:
// Product (top) = FactorA (bottom-left) × FactorB (bottom-right)

function fontSizeFor(value) {
  const len = String(value).length;
  if (len <= 2) return '1.35rem';
  if (len === 3) return '1.15rem';
  if (len === 4) return '0.98rem';
  return '0.82rem'; // 5+ digit products
}

export default function MultiplicationTriangle({ factorA, factorB, product, missing = 'none', animated = false }) {
  const isMissing = (slot) => missing === slot;
  const display = (val, slot) => (isMissing(slot) ? '?' : val.toLocaleString());
  const fillFor = (slot) => (isMissing(slot) ? '#FFF9C4' : slot === 'product' ? '#4A90D9' : '#FF8A50');
  const strokeFor = (slot) => (isMissing(slot) ? '#FFB300' : slot === 'product' ? '#2E5C8A' : '#E65C00');
  const dashFor = (slot) => (isMissing(slot) ? '6 4' : 'none');

  return (
    <svg
      viewBox="0 0 300 240"
      className={`equal-groups-diagram${animated ? ' animated' : ''}`}
      role="img"
      aria-label={`Multiplication triangle: ${factorA} times ${factorB} equals ${product}`}
    >
      {/* Branch lines */}
      <line x1="150" y1="82" x2="80"  y2="158" stroke="#9B8AC4" strokeWidth="3" />
      <line x1="150" y1="82" x2="220" y2="158" stroke="#9B8AC4" strokeWidth="3" />

      {/* Product — top circle */}
      <circle cx="150" cy="56" r="48" fill={fillFor('product')} stroke={strokeFor('product')}
        strokeWidth="3" strokeDasharray={dashFor('product')} />
      <text x="150" y="63" textAnchor="middle" className="diagram-num" style={{ fontSize: fontSizeFor(display(product, 'product')) }}>{display(product, 'product')}</text>
      <text x="150" y="18" textAnchor="middle" className="diagram-label">Product</text>

      {/* FactorA — bottom-left */}
      <circle cx="80" cy="184" r="38" fill={fillFor('factorA')} stroke={strokeFor('factorA')}
        strokeWidth="3" strokeDasharray={dashFor('factorA')} />
      <text x="80" y="191" textAnchor="middle" className="diagram-num" style={{ fontSize: fontSizeFor(display(factorA, 'factorA')) }}>{display(factorA, 'factorA')}</text>
      <text x="80" y="234" textAnchor="middle" className="diagram-label">Factor</text>

      {/* FactorB — bottom-right */}
      <circle cx="220" cy="184" r="38" fill={fillFor('factorB')} stroke={strokeFor('factorB')}
        strokeWidth="3" strokeDasharray={dashFor('factorB')} />
      <text x="220" y="191" textAnchor="middle" className="diagram-num" style={{ fontSize: fontSizeFor(display(factorB, 'factorB')) }}>{display(factorB, 'factorB')}</text>
      <text x="220" y="234" textAnchor="middle" className="diagram-label">Factor</text>
    </svg>
  );
}
