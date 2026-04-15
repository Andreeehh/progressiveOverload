import { useEffect, useState } from "react";
import { Exercise } from "../models/Exercise";
import { loadData, saveData } from "../services/storageService";
import { mockExercises } from "../data/mockExercises";

/**
 * Hook para gerenciar exercícios
 */
export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load inicial
   */
  useEffect(() => {
    const init = async () => {
      const stored = await loadData();

      if (stored.exercises && stored.exercises.length > 0) {
        setExercises(stored.exercises);
      } else {
        setExercises(mockExercises);
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

    const updateStorage = async () => {
      const currentData = await loadData();
      await saveData({
        ...currentData,
        exercises,
      });
    };

    void updateStorage();
  }, [exercises, isInitialized]);

  /**
   * ➕ Adicionar exercício
   */
  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, exercise]);
  };

  /**
   * ✏️ Atualizar exercício
   */
  const updateExercise = (
    exerciseId: string,
    updatedExercise: Partial<Exercise>,
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex,
      ),
    );
  };

  /**
   * 🗑️ Remover exercício
   */
  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  return {
    exercises,
    loading,

    // actions
    addExercise,
    updateExercise,
    removeExercise,
  };
};
