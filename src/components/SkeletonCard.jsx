import React from 'react';

function SkeletonCard() {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100 border-0 shadow-sm" aria-hidden="true">
        
        {/* IMAGEM FALSA (Pisca) */}
        <div 
          className="card-img-top placeholder-glow" 
          style={{ height: '300px', backgroundColor: '#e0e0e0' }}
        >
          <span className="placeholder w-100 h-100"></span>
        </div>
        
        {/* CORPO DO CARTÃO */}
        <div className="card-body d-flex flex-column">
          
          {/* Título Falso */}
          <h5 className="card-title placeholder-glow">
            <span className="placeholder col-8 bg-secondary rounded"></span>
          </h5>
          
          {/* Badges Falsas */}
          <div className="mb-2 placeholder-glow">
            <span className="placeholder col-3 bg-warning me-1 rounded"></span>
            <span className="placeholder col-3 bg-secondary rounded"></span>
          </div>
          
          {/* Botão Falso */}
          <div className="mt-auto placeholder-glow">
            <span className="placeholder col-12 btn btn-primary disabled rounded-pill" style={{ height: '40px' }}></span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;