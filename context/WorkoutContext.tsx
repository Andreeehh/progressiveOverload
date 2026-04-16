import React, { createContext, useContext, useEffect, useState } from "react";
import { AppData } from "../models/AppData";
import { Exercise } from "../models/Exercise";
import { ExerciseVariation } from "../models/ExerciseVariation";
import { MuscleGroup } from "../models/MuscleGroup";
import { Workout } from "../models/Workout";
import { WorkoutExercise } from "../models/WorkoutExercise";
import { WorkoutSet } from "../models/WorkoutSet";
import { WorkoutExecution } from "../models/WorkoutExecution";
import { loadData, saveData } from "../services/storageService";
import { mockExercises } from "../data/mockExercises";
import { mockMuscleGroups } from "../data/mockMuscleGroups";
import { mockVariations } from "../data/mockVariations";
import { mockWorkout } from "../data/mockData";
import {
  validateProgression,
  suggestReps,
} from "../services/progressionService";

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

  // Funções para workouts
  const addWorkout = (workout: Workout) => {
    setAppData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, workout],
    }));
  };

  const addExerciseToWorkout = (
    workoutId: string,
    exercise: WorkoutExercise,
  ) => {
    setAppData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;

        // 🔒 valida duplicado
        const alreadyExists = w.exercises.some(
          (ex) => ex.variationId === exercise.variationId,
        );

        if (alreadyExists) {
          console.log("⚠️ Exercício já existe no treino");
          return w; // 🚫 não adiciona
        }

        return {
          ...w,
          exercises: [...w.exercises, exercise],
        };
      }),
    }));
  };

  const updateExerciseSets = (
    workoutId: string,
    variationId: string,
    workoutSets: WorkoutSet[],
  ) => {
    setAppData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;

        return {
          ...w,
          exercises: w.exercises.map((ex) =>
            ex.variationId === variationId ? { ...ex, workoutSets } : ex,
          ),
        };
      }),
    }));
  };

  const removeExerciseFromWorkout = (
    workoutId: string,
    variationId: string,
  ) => {
    setAppData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;

        return {
          ...w,
          exercises: w.exercises.filter((ex) => ex.variationId !== variationId),
        };
      }),
    }));
  };

  const moveExercise = (
    workoutId: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    setAppData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => {
        if (w.id !== workoutId) return w;

        const updated = [...w.exercises];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);

        return {
          ...w,
          exercises: updated,
        };
      }),
    }));
  };

  const removeWorkout = (workoutId: string) => {
    setAppData((prev) => ({
      ...prev,
      workouts: prev.workouts
        .map((w) => {
          if (w.id !== workoutId) return w;

          const hasExecution = w.exercises.some((ex) =>
            ex.workoutSets.some((set) => set.reps > 0 || set.weight > 0),
          );

          // 🔥 Se já foi executado → soft delete
          if (hasExecution) {
            return {
              ...w,
              isDeleted: true,
            };
          }

          // 🔥 Se não foi executado → remove de verdade
          return null;
        })
        .filter(Boolean) as Workout[],
    }));
  };

  const completeWorkout = (workoutId: string) => {
    const now = new Date().toISOString();

    setAppData((prev) => {
      const workout = prev.workouts.find((w) => w.id === workoutId);
      if (!workout) return prev;

      const newExecutions: WorkoutExecution[] = workout.exercises
        .filter((ex) =>
          ex.workoutSets.some((set) => set.reps > 0 || set.weight > 0),
        )
        .map((ex) => ({
          id: `${workoutId}-${ex.variationId}-${now}`,
          variationId: ex.variationId,
          workoutSets: ex.workoutSets.map((set) => ({
            ...set,
            performedAt: now,
          })),
          date: now,
        }));

      const updated = {
        ...prev,
        workoutExecutions: [...prev.workoutExecutions, ...newExecutions],
        workouts: prev.workouts.map((w) => {
          if (w.id !== workoutId) return w;

          // Atualizar data do workout
          return {
            ...w,
            date: now,
          };
        }),
      };

      return updated;
    });
  };

  // Funções de inteligência
  const getLastExerciseSets = (variationId: string): WorkoutSet[] => {
    const sorted = [...appData.workoutExecutions]
      .filter((exec) => exec.variationId === variationId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length > 0) {
      return sorted[0].workoutSets;
    }

    return [];
  };

  const checkProgression = (
    variationId: string,
    currentWorkoutSets: WorkoutSet[],
  ) => {
    const previousSets = getLastExerciseSets(variationId);

    return validateProgression(previousSets, currentWorkoutSets);
  };

  const getSuggestedReps = (variationId: string, newWeight: number): number => {
    const previousSets = getLastExerciseSets(variationId);

    return suggestReps(previousSets, newWeight);
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
    addWorkout,
    addExerciseToWorkout,
    updateExerciseSets,
    removeExerciseFromWorkout,
    moveExercise,
    removeWorkout,
    completeWorkout,

    // Intelligence
    checkProgression,
    getSuggestedReps,
    getLastExerciseSets,

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
