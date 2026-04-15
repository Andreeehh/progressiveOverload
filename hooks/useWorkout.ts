import { useEffect, useState } from "react";
import { AppData } from "../models/AppData";
import { Workout } from "../models/Workout";
import { WorkoutExercise } from "../models/WorkoutExercise";
import { WorkoutSet } from "../models/WorkoutSet";
import { WorkoutExecution } from "../models/WorkoutExecution";

import { loadData, saveData } from "../services/storageService";
import {
  validateProgression,
  suggestReps,
} from "../services/progressionService";

import { mockWorkout } from "../data/mockData";

/**
 * Hook principal do app
 */
export const useWorkout = () => {
  const [data, setData] = useState<AppData>({
    workouts: [],
    exercises: [],
    exerciseVariations: [],
    mesocycles: [],
    muscleGroups: [],
    workoutExecutions: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load inicial
   */
  useEffect(() => {
    const init = async () => {
      const stored = await loadData();

      if (stored.workouts.length > 0) {
        setData(stored);
      } else {
        setData({
          workouts: [mockWorkout],
          exercises: [],
          exerciseVariations: [],
          mesocycles: [],
          muscleGroups: [],
          workoutExecutions: [],
        });
      }

      setLoading(false);
    };

    init();
  }, []);

  const isInitialized = !loading;

  /**
   * Persistência automática
   */
  useEffect(() => {
    if (!isInitialized) return;

    void saveData(data);
  }, [data, isInitialized]);

  /**
   * ➕ Adicionar novo treino
   */
  const addWorkout = (workout: Workout) => {
    setData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, workout],
    }));
  };

  /**
   * ➕ Adicionar exercício em um treino
   */
  const addExerciseToWorkout = (
    workoutId: string,
    exercise: WorkoutExercise,
  ) => {
    setData((prev) => ({
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

  /**
   * ➕ Atualizar sets de um exercício
   */
  const updateExerciseSets = (
    workoutId: string,
    variationId: string,
    workoutSets: WorkoutSet[],
  ) => {
    setData((prev) => ({
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

  /**
   * 🔍 Pega último treino do exercício
   */
  const getLastExerciseSets = (variationId: string): WorkoutSet[] => {
    const sorted = [...data.workoutExecutions]
      .filter((exec) => exec.variationId === variationId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sorted.length > 0) {
      return sorted[0].workoutSets;
    }

    return [];
  };

  /**
   * 🔥 Valida progressão automaticamente
   */
  const checkProgression = (
    variationId: string,
    currentWorkoutSets: WorkoutSet[],
  ) => {
    const previousSets = getLastExerciseSets(variationId);

    return validateProgression(previousSets, currentWorkoutSets);
  };

  /**
   * 🤖 Sugere reps automaticamente
   */
  const getSuggestedReps = (variationId: string, newWeight: number): number => {
    const previousSets = getLastExerciseSets(variationId);

    return suggestReps(previousSets, newWeight);
  };

  const removeExerciseFromWorkout = (
    workoutId: string,
    variationId: string,
  ) => {
    setData((prev) => ({
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
    setData((prev) => ({
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
    setData((prev) => ({
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

  /**
   * ✅ Marcar treino como completo (com histórico)
   */
  const completeWorkout = (workoutId: string) => {
    const now = new Date().toISOString();

    console.log("📋 ANTES DE SALVAR:", data.workouts);

    setData((prev) => {
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

      console.log("✅ DEPOIS DE SALVAR:", updated.workouts);
      return updated;
    });
  };

  return {
    data,
    loading,

    // actions
    addWorkout,
    addExerciseToWorkout,
    updateExerciseSets,
    removeExerciseFromWorkout,
    moveExercise,
    removeWorkout,
    completeWorkout,

    // intelligence
    checkProgression,
    getSuggestedReps,
    getLastExerciseSets,
  };
};
