import React, { createContext, useContext, useEffect, useState } from "react";
import { AppData } from "../models/AppData";
import { Exercise } from "../models/Exercise";
import { ExerciseVariation } from "../models/ExerciseVariation";
import { MuscleGroup } from "../models/MuscleGroup";
import { loadData, saveData } from "../services/storageService";
import { mockExercises } from "../data/mockExercises";
import { mockMuscleGroups } from "../data/mockMuscleGroups";
import { mockVariations } from "../data/mockVariations";
import { mockWorkout } from "../data/mockData";

const WorkoutContext = createContext<any>(null);

export const WorkoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appData, setAppData] = useState<AppData>({
    workouts: [],
    exercises: [],
    exerciseVariations: [],
    mesocycles: [],
    muscleGroups: [],
    workoutExecutions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Load inicial
  useEffect(() => {
    const init = async () => {
      const stored = await loadData();

      if (
        stored.exercises.length > 0 ||
        stored.muscleGroups.length > 0 ||
        stored.exerciseVariations.length > 0 ||
        stored.workouts.length > 0
      ) {
        setAppData(stored);
      } else {
        setAppData({
          workouts: [mockWorkout],
          exercises: mockExercises,
          exerciseVariations: mockVariations,
          mesocycles: [],
          muscleGroups: mockMuscleGroups,
          workoutExecutions: [],
        });
      }

      setLoading(false);
    };

    init();
  }, []);

  // Save automático
  useEffect(() => {
    if (loading) return;

    const updateStorage = async () => {
      await saveData(appData);
    };

    void updateStorage();
  }, [appData, loading]);

  // Funções para exercises
  const addExercise = (exercise: Exercise) => {
    setAppData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const updateExercise = (
    exerciseId: string,
    updatedExercise: Partial<Exercise>,
  ) => {
    setAppData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex,
      ),
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setAppData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  // Funções para muscleGroups
  const addMuscleGroup = (muscleGroup: MuscleGroup) => {
    setAppData((prev) => ({
      ...prev,
      muscleGroups: [...prev.muscleGroups, muscleGroup],
    }));
  };

  const updateMuscleGroup = (
    muscleGroupId: string,
    updatedMuscleGroup: Partial<MuscleGroup>,
  ) => {
    setAppData((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.map((mg) =>
        mg.id === muscleGroupId ? { ...mg, ...updatedMuscleGroup } : mg,
      ),
    }));
  };

  const removeMuscleGroup = (muscleGroupId: string) => {
    setAppData((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.filter((mg) => mg.id !== muscleGroupId),
    }));
  };

  // Funções para exerciseVariations
  const addExerciseVariation = (variation: ExerciseVariation) => {
    setAppData((prev) => ({
      ...prev,
      exerciseVariations: [...prev.exerciseVariations, variation],
    }));
  };

  const updateExerciseVariation = (
    variationId: string,
    updatedVariation: Partial<ExerciseVariation>,
  ) => {
    setAppData((prev) => ({
      ...prev,
      exerciseVariations: prev.exerciseVariations.map((v) =>
        v.id === variationId ? { ...v, ...updatedVariation } : v,
      ),
    }));
  };

  const removeExerciseVariation = (variationId: string) => {
    setAppData((prev) => ({
      ...prev,
      exerciseVariations: prev.exerciseVariations.filter(
        (v) => v.id !== variationId,
      ),
    }));
  };

  // Helpers for muscleGroups
  const isNameTaken = (name: string, excludeId?: string): boolean => {
    return appData.muscleGroups.some(
      (group) =>
        group.name.toLowerCase() === name.toLowerCase().trim() &&
        group.id !== excludeId,
    );
  };

  // Helpers for exerciseVariations
  const getVariationsByExercise = (exerciseId: string) => {
    return appData.exerciseVariations.filter(
      (v) => v.exerciseId === exerciseId,
    );
  };

  const getVariationById = (variationId: string) => {
    return appData.exerciseVariations.find((v) => v.id === variationId);
  };

  const contextValue = {
    // Data
    workouts: appData.workouts,
    exercises: appData.exercises,
    muscleGroups: appData.muscleGroups,
    exerciseVariations: appData.exerciseVariations,
    mesocycles: appData.mesocycles,
    workoutExecutions: appData.workoutExecutions,
    loading,

    // Actions
    addExercise,
    updateExercise,
    removeExercise,
    addMuscleGroup,
    updateMuscleGroup,
    removeMuscleGroup,
    addExerciseVariation,
    updateExerciseVariation,
    removeExerciseVariation,

    // Helpers
    isNameTaken,
    getVariationsByExercise,
    getVariationById,
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
