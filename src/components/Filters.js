
// src/components/Filters.js
import React from 'react';

function Filters({ 
  ageRange, 
  currentAgeFilter, 
  setCurrentAgeFilter, 
  searchName, 
  setSearchName, 
  searchAge, 
  setSearchAge, 
  alphaSorted, 
  setAlphaSorted,
  displayCount,
  setDisplayCount
}) {
  return (
    <div className="filters-container">
      <div className="search-filters">
        <div className="search-row">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Pesquisar por idade exata..."
            value={searchAge}
            onChange={(e) => setSearchAge(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="age-filter">
        <p>Filtrar por faixa etária: {currentAgeFilter.min} - {currentAgeFilter.max} anos</p>
        <div className="range-inputs">
          <input
            type="range"
            min={ageRange.min}
            max={ageRange.max}
            value={currentAgeFilter.min}
            onChange={(e) => setCurrentAgeFilter({
              ...currentAgeFilter,
              min: parseInt(e.target.value, 10)
            })}
            className="range-slider"
          />
          <input
            type="range"
            min={ageRange.min}
            max={ageRange.max}
            value={currentAgeFilter.max}
            onChange={(e) => setCurrentAgeFilter({
              ...currentAgeFilter,
              max: parseInt(e.target.value, 10)
            })}
            className="range-slider"
          />
        </div>
      </div>
      
      <div className="action-filters">
        <button 
          className={`sort-button ${alphaSorted ? 'active' : ''}`}
          onClick={() => setAlphaSorted(!alphaSorted)}
        >
          {alphaSorted ? '✓ Ordenado por Nome' : 'Ordenar por Nome'}
        </button>
        
        <div className="display-toggle">
          <p>Exibir:</p>
          <div className="toggle-buttons">
            <button 
              className={displayCount === 20 ? 'active' : ''}
              onClick={() => setDisplayCount(20)}
            >
              20
            </button>
            <button 
              className={displayCount === 50 ? 'active' : ''}
              onClick={() => setDisplayCount(50)}
            >
              50
            </button>
            <button 
              className={displayCount === 100 ? 'active' : ''}
              onClick={() => setDisplayCount(100)}
            >
              100
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;