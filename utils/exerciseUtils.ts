import { ExerciseVariation } from '../models/ExerciseVariation';
import { Exercise } from '../models/Exercise';
import { MuscleGroup } from '../models/MuscleGroup';

/**
 * 🔥 Nome completo: Exercício + Variação
 */
export const getExerciseFullName = (
  variation: ExerciseVariation,
  exercises: Exercise[]
): string => {
  const exercise = exercises.find(
    (e) => e.id === variation.exerciseId
  );

  if (!exercise) return variation.name;

  return `${exercise.name} - ${variation.name}`;
};

export const getExerciseDisplay = (
  variation: ExerciseVariation,
  exercises: Exercise[],
  muscleGroups: MuscleGroup[]
) => {
  const exercise = exercises.find(
    (e) => e.id === variation.exerciseId
  );

  const muscleGroup = muscleGroups.find(
    (m) => m.id === exercise?.muscleGroupId
  );

  return {
    groupName: muscleGroup?.name || '',
    fullName: exercise
      ? `${exercise.name} - ${variation.name}`
      : variation.name,
  };
};