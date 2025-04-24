const timerReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TIMER':
        return {
          ...state,
          timers: [...state.timers, action.payload],
        };
      case 'UPDATE_TIMER':
        return {
          ...state,
          timers: state.timers.map(timer =>
            timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
          ),
        };
      case 'ADD_HISTORY':
        return {
          ...state,
          history: [...state.history, action.payload],
        };
      case 'LOAD_STATE':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default timerReducer;