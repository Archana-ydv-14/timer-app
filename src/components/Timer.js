import React from 'react';

const Timer = ({ timer, onStart, onPause, onReset, isNew }) => {
  const progress = (timer.remaining / timer.duration) * 100;

  return (
    <div className={`timer-item ${isNew ? 'new' : ''}`}>
      <div className="timer-header">
        <span>{timer.name}</span>
        <span>
          {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <div className="timer-progress">
        <div className="timer-progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="timer-controls">
        <span className="timer-status">Status: {timer.status}</span>
        <div className="timer-buttons">
          <button
            onClick={() => onStart(timer.id)}
            className="timer-button start"
          >
            Start
          </button>
          <button
            onClick={() => onPause(timer.id)}
            className="timer-button pause"
          >
            Pause
          </button>
          <button
            onClick={() => onReset(timer.id)}
            className="timer-button reset"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;