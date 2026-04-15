import React, { createContext, useContext } from "react";
import { useWorkout } from "../hooks/useWorkout";
import { useExercises } from "../hooks/useExercises";
import { useMuscleGroups } from "../hooks/useMuscleGroups";

const WorkoutContext = createContext<
  | (ReturnType<typeof useWorkout> &
      ReturnType<typeof useExercises> &
      ReturnType<typeof useMuscleGroups>)
  | null
>(null);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const workout = useWorkout();
  const exercises = useExercises();
  const muscleGroups = useMuscleGroups();

  const contextValue = {
    ...workout,
    ...exercises,
    ...muscleGroups,
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error("useWorkoutContext deve ser usado dentro do Provider");
  }

  return context;
};
