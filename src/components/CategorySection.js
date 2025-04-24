import React, { useState } from 'react';
import Timer from './Timer';

const CategorySection = ({
  category,
  timers,
  onStart,
  onPause,
  onReset,
  onBulkStart,
  onBulkPause,
  onBulkReset,
  newTimerId, // Receive newTimerId
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="category-section">
      <div className="category-header">
        <h2>{category}</h2>
        <div className="category-buttons">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="category-button expand"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={() => onBulkStart(category)}
            className="category-button start-all"
          >
            Start All
          </button>
          <button
            onClick={() => onBulkPause(category)}
            className="category-button pause-all"
          >
            Pause All
          </button>
          <button
            onClick={() => onBulkReset(category)}
            className="category-button reset-all"
          >
            Reset All
          </button>
        </div>
      </div>
      {isExpanded && (
        <div style={{ marginTop: '8px' }}>
          {timers.map(timer => (
            <Timer
              key={timer.id}
              timer={timer}
              onStart={onStart}
              onPause={onPause}
              onReset={onReset}
              isNew={timer.id === newTimerId} // Pass isNew prop
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;