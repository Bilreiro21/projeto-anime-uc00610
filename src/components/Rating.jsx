import React, { useState } from 'react';

function Rating({ valorAtual, onRate }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="d-flex align-items-center gap-1">
      <span className="me-2 fw-bold">A minha nota:</span>
      {[1, 2, 3, 4, 5].map((estrela) => {
        const isFilled = estrela <= (hover || valorAtual);
        return (
          <button
            key={estrela}
            type="button"
            className={`btn p-0 border-0 bg-transparent ${isFilled ? 'star-filled' : 'star-empty'}`}
            style={{ fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer', transition: 'color 0.2s' }}
            onClick={() => onRate(estrela)}
            onMouseEnter={() => setHover(estrela)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        );
      })}
      <span className="ms-2 text-muted small">
        ({valorAtual > 0 ? valorAtual : 0}/5)
      </span>
    </div>
  );
}

export default Rating;