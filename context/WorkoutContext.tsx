import React, { createContext, useContext } from 'react';
import { useWorkout } from '../hooks/useWorkout';

const WorkoutContext = createContext<ReturnType<typeof useWorkout> | null>(null);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const workout = useWorkout();

  return (
    <WorkoutContext.Provider value={workout}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error('useWorkoutContext deve ser usado dentro do Provider');
  }

  return context;
};