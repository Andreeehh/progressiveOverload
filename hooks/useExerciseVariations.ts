import { useEffect, useState } from "react";
import { ExerciseVariation } from "../models/ExerciseVariation";
import { loadData, saveData } from "../services/storageService";
import { mockVariations } from "../data/mockVariations";

/**
 * Hook para gerenciar variações de exercícios
 */
export const useExerciseVariations = () => {
  const [exerciseVariations, setExerciseVariations] = useState<
    ExerciseVariation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load inicial
   */
  useEffect(() => {
    const init = async () => {
      const stored = await loadData();

      if (stored.exerciseVariations && stored.exerciseVariations.length > 0) {
        setExerciseVariations(stored.exerciseVariations);
      } else {
        setExerciseVariations(mockVariations);
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
        exerciseVariations,
      });
    };

    void updateStorage();
  }, [exerciseVariations, isInitialized]);

  /**
   * ➕ Adicionar variação
   */
  const addExerciseVariation = (variation: ExerciseVariation) => {
    setExerciseVariations((prev) => [...prev, variation]);
  };

  /**
   * ✏️ Atualizar variação
   */
  const updateExerciseVariation = (
    variationId: string,
    updatedVariation: Partial<ExerciseVariation>,
  ) => {
    setExerciseVariations((prev) =>
      prev.map((variation) =>
        variation.id === variationId
          ? { ...variation, ...updatedVariation }
          : variation,
      ),
    );
  };

  /**
   * 🗑️ Remover variação
   */
  const removeExerciseVariation = (variationId: string) => {
    setExerciseVariations((prev) =>
      prev.filter((variation) => variation.id !== variationId),
    );
  };

  /**
   * 🔍 Obter variações por exercício
   */
  const getVariationsByExercise = (exerciseId: string) => {
    return exerciseVariations.filter((v) => v.exerciseId === exerciseId);
  };

  /**
   * 🔍 Obter variação por ID
   */
  const getVariationById = (variationId: string) => {
    return exerciseVariations.find((v) => v.id === variationId);
  };

  return {
    exerciseVariations,
    loading,

    // actions
    addExerciseVariation,
    updateExerciseVariation,
    removeExerciseVariation,

    // helpers
    getVariationsByExercise,
    getVariationById,
  };
};
