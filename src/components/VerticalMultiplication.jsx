// src/components/VerticalMultiplication.jsx
// Presentational-only standard-algorithm setup: factorA stacked over factorB
// with a "?" beneath the line where the product goes. Used by QuestionCard
// for verticalMultiplication / mixedReviewBoss(vertical) questions — the
// actual product is never shown here since it IS the multiple-choice answer.
export default function VerticalMultiplication({ factorA, factorB }) {
  return (
    <div className="vertical-mult">
      <div className="vertical-mult-row">{factorA.toLocaleString()}</div>
      <div className="vertical-mult-row">
        <span className="vertical-mult-op">×</span>{factorB.toLocaleString()}
      </div>
      <div className="vertical-mult-line" />
      <div className="vertical-mult-answer">?</div>
    </div>
  );
}
