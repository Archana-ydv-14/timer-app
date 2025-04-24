import React, { useState, useEffect, useReducer } from 'react';
import timerReducer from './timerReducer';
import CategorySection from './components/CategorySection';
import Modal from './components/Modal';
import './App.css';

const App = () => {
  const [state, dispatch] = useReducer(timerReducer, { timers: [], history: [] });
  const [newTimer, setNewTimer] = useState({ name: '', duration: '', category: '' });
  const [modal, setModal] = useState({ isOpen: false, message: '' });
  const [screen, setScreen] = useState('home');
  const [newTimerId, setNewTimerId] = useState(null); // Track newly added timer

  // Load persisted data
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(state));
  }, [state]);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach(timer => {
        if (timer.status === 'Running' && timer.remaining > 0) {
          const newRemaining = timer.remaining - 1;
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { id: timer.id, remaining: newRemaining },
          });

          // Halfway alert
          if (timer.alert && newRemaining === Math.floor(timer.duration / 2)) {
            setModal({ isOpen: true, message: `${timer.name} is halfway done!` });
          }

          // Timer completion
          if (newRemaining === 0) {
            dispatch({
              type: 'UPDATE_TIMER',
              payload: { id: timer.id, status: 'Completed' },
            });
            dispatch({
              type: 'ADD_HISTORY',
              payload: {
                id: Date.now(),
                name: timer.name,
                completionTime: new Date().toLocaleString(),
              },
            });
            setModal({ isOpen: true, message: `Congratulations! ${timer.name} completed!` });
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.timers]);

  const addTimer = () => {
    if (newTimer.name && newTimer.duration && newTimer.category) {
      const id = Date.now();
      dispatch({
        type: 'ADD_TIMER',
        payload: {
          id,
          name: newTimer.name,
          duration: parseInt(newTimer.duration),
          remaining: parseInt(newTimer.duration),
          category: newTimer.category,
          status: 'Paused',
          alert: true,
        },
      });
      setNewTimer({ name: '', duration: '', category: '' });
      setNewTimerId(id); // Mark as new
      // Remove 'new' class after 2 seconds
      setTimeout(() => {
        setNewTimerId(null);
      }, 2000);
    }
  };

  const handleStart = id => {
    dispatch({ type: 'UPDATE_TIMER', payload: { id, status: 'Running' } });
  };

  const handlePause = id => {
    dispatch({ type: 'UPDATE_TIMER', payload: { id, status: 'Paused' } });
  };

  const handleReset = id => {
    const timer = state.timers.find(t => t.id === id);
    dispatch({
      type: 'UPDATE_TIMER',
      payload: { id, remaining: timer.duration, status: 'Paused' },
    });
  };

  const handleBulkStart = category => {
    state.timers.forEach(timer => {
      if (timer.category === category && timer.status !== 'Completed') {
        dispatch({ type: 'UPDATE_TIMER', payload: { id: timer.id, status: 'Running' } });
      }
    });
  };

  const handleBulkPause = category => {
    state.timers.forEach(timer => {
      if (timer.category === category) {
        dispatch({ type: 'UPDATE_TIMER', payload: { id: timer.id, status: 'Paused' } });
      }
    });
  };

  const handleBulkReset = category => {
    state.timers.forEach(timer => {
      if (timer.category === category) {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: { id: timer.id, remaining: timer.duration, status: 'Paused' },
        });
      }
    });
  };

  const groupedTimers = state.timers.reduce((acc, timer) => {
    acc[timer.category] = acc[timer.category] || [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <div className="nav-buttons">
        <button onClick={() => setScreen('home')} className="nav-button">
          Home
        </button>
        <button onClick={() => setScreen('history')} className="nav-button">
          History
        </button>
      </div>

      {screen === 'home' ? (
        <>
          <div className="timer-form">
            <h1>Create Timer</h1>
            <input
              type="text"
              placeholder="Timer Name"
              value={newTimer.name}
              onChange={e => setNewTimer({ ...newTimer, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={newTimer.duration}
              onChange={e => setNewTimer({ ...newTimer, duration: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={newTimer.category}
              onChange={e => setNewTimer({ ...newTimer, category: e.target.value })}
            />
            <button onClick={addTimer}>Add Timer</button>
          </div>

          {Object.keys(groupedTimers).map(category => (
            <CategorySection
              key={category}
              category={category}
              timers={groupedTimers[category]}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onBulkStart={handleBulkStart}
              onBulkPause={handleBulkPause}
              onBulkReset={handleBulkReset}
              newTimerId={newTimerId} // Pass newTimerId to apply highlight
            />
          ))}
        </>
      ) : (
        <div>
          <h1 className="timer-form">Timer History</h1>
          {state.history.map(entry => (
            <div key={entry.id} className="history-item">
              <span>{entry.name}</span> - Completed: {entry.completionTime}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={() => setModal({ isOpen: false, message: '' })}
      />
    </div>
  );
};

export default App;