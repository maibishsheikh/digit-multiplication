// src/components/AreaModelDiagram.jsx
// Presentational-only place-value breakdown visual for the "area model" /
// partial-products strategy: shows factorA broken into place-value tiles,
// each multiplied by factorB. If `chosenPart` is supplied, that ONE tile's
// product is hidden behind a "?" (it's the multiple-choice answer being
// asked about) while the other tiles show their real partial products for
// context — never spoiling the answer.
export default function AreaModelDiagram({ factorB, parts, chosenPart }) {
  return (
    <div className="area-model-diagram">
      {parts.map((p, i) => {
        const isTarget = chosenPart !== undefined && p === chosenPart;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span className="area-model-plus">+</span>}
            <div className={`area-model-tile${isTarget ? ' area-model-tile--target' : ''}`}>
              <span className="area-model-part">{p.toLocaleString()}</span>
              <span className="area-model-times">× {factorB.toLocaleString()}</span>
              <span className="area-model-eq">{isTarget ? '?' : (p * factorB).toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
