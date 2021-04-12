import React, { createContext, useContext, useReducer } from "react";

export const AppContext = createContext();
export const PusherContext = createContext();

export const StateProvider = ({ reducer, initialState, pusher, children }) => (
  <AppContext.Provider value={useReducer(reducer, initialState)}>
    <PusherContext.Provider value={{ pusher }}>
      {children}
    </PusherContext.Provider>
  </AppContext.Provider>
);

// Create custom hook for using the Pusher Context
// Fail fast if not within a PusherProvider (thx Kent C. Dodds)
export const usePusher = function usePusher() {
  const context = React.useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }

  const { pusher } = context;
  return pusher;
};

export const useStateValue = () => useContext(AppContext);
