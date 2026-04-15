import { useEffect, useState } from "react";
import { MuscleGroup } from "../models/MuscleGroup";
import { loadData, saveData } from "../services/storageService";
import { mockMuscleGroups } from "../data/mockMuscleGroups";

/**
 * Hook para gerenciar grupos musculares
 */
export const useMuscleGroups = () => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Load inicial
   */
  useEffect(() => {
    const init = async () => {
      const stored = await loadData();

      if (stored.muscleGroups && stored.muscleGroups.length > 0) {
        setMuscleGroups(stored.muscleGroups);
      } else {
        setMuscleGroups(mockMuscleGroups);
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
        muscleGroups,
      });
    };

    void updateStorage();
  }, [muscleGroups, isInitialized]);

  /**
   * ➕ Adicionar grupo muscular
   */
  const addMuscleGroup = (muscleGroup: MuscleGroup) => {
    setMuscleGroups((prev) => [...prev, muscleGroup]);
  };

  /**
   * ✏️ Atualizar grupo muscular
   */
  const updateMuscleGroup = (
    groupId: string,
    updatedGroup: Partial<MuscleGroup>,
  ) => {
    setMuscleGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, ...updatedGroup } : group,
      ),
    );
  };

  /**
   * 🗑️ Remover grupo muscular
   */
  const removeMuscleGroup = (groupId: string) => {
    setMuscleGroups((prev) => prev.filter((group) => group.id !== groupId));
  };

  /**
   * 🔍 Verificar se nome já existe
   */
  const isNameTaken = (name: string, excludeId?: string): boolean => {
    return muscleGroups.some(
      (group) =>
        group.name.toLowerCase() === name.toLowerCase().trim() &&
        group.id !== excludeId,
    );
  };

  return {
    muscleGroups,
    loading,

    // actions
    addMuscleGroup,
    updateMuscleGroup,
    removeMuscleGroup,

    // helpers
    isNameTaken,
  };
};
