import { WorkoutSet } from "../models/WorkoutSet";
import {
  ProgressionResult,
  ProgressionComparison,
  ProgressionConfig,
  PROGRESSION_STATUS,
} from "../models/Progression";

/**
 * Config padrão do app
 */
const DEFAULT_CONFIG: ProgressionConfig = {
  minRepDropRatio: 0.85,
  minReps: 4,
};

/**
 * Soma total de reps
 */
export const sumReps = (sets: WorkoutSet[]): number => {
  return sets.reduce((acc, set) => acc + set.reps, 0);
};

/**
 * Volume total (carga * reps)
 */
export const calculateVolume = (sets: WorkoutSet[]): number => {
  return sets.reduce((acc, set) => acc + set.weight * set.reps, 0);
};

/**
 * Média de carga
 */
export const averageWeight = (sets: WorkoutSet[]): number => {
  if (sets.length === 0) return 0;

  const total = sets.reduce((acc, set) => acc + set.weight, 0);
  return total / sets.length;
};

/**
 * Média de RIR
 */
export const averageRir = (sets: WorkoutSet[]): number => {
  if (sets.length === 0) return 0;

  const total = sets.reduce((acc, set) => acc + set.rir, 0);
  return total / sets.length;
};

/**
 * 🔥 Validação principal de progressão
 */
export const validateProgression = (
  previousWorkoutSets: WorkoutSet[],
  currentWorkoutSets: WorkoutSet[],
  config: ProgressionConfig = DEFAULT_CONFIG,
): ProgressionResult => {
  const prevVolume = calculateVolume(previousWorkoutSets);
  const currVolume = calculateVolume(currentWorkoutSets);

  const prevReps = sumReps(previousWorkoutSets);
  const currReps = sumReps(currentWorkoutSets);

  // 🟡 Primeira execução
  if (previousWorkoutSets.length === 1) {
    return {
      isValid: true,
      status: PROGRESSION_STATUS.FIRST_TIME,
      reason: "Primeira execução",
      previousVolume: 0,
      currentVolume: currVolume,
      previousReps: 0,
      currentReps: currReps,
    };
  }

  // 🔴 Queda excessiva de reps
  if (currReps < prevReps * config.minRepDropRatio) {
    return {
      isValid: false,
      status: PROGRESSION_STATUS.EXCESSIVE_REP_DROP,
      reason: "Queda excessiva de repetições",
      previousVolume: prevVolume,
      currentVolume: currVolume,
      previousReps: prevReps,
      currentReps: currReps,
    };
  }

  // 🔴 Volume não aumentou
  if (currVolume <= prevVolume) {
    return {
      isValid: false,
      status: PROGRESSION_STATUS.NO_VOLUME_INCREASE,
      reason: "Volume não aumentou",
      previousVolume: prevVolume,
      currentVolume: currVolume,
      previousReps: prevReps,
      currentReps: currReps,
    };
  }

  // 🟢 Progressão válida
  return {
    isValid: true,
    status: PROGRESSION_STATUS.PROGRESSION,
    reason: "Progressão válida",
    previousVolume: prevVolume,
    currentVolume: currVolume,
    previousReps: prevReps,
    currentReps: currReps,
  };
};

/**
 * 🤖 Sugere reps baseado na nova carga
 */
export const suggestReps = (
  previousWorkoutSets: WorkoutSet[],
  newWeight: number,
  config: ProgressionConfig = DEFAULT_CONFIG,
): number => {
  if (previousWorkoutSets.length === 0) return 10;

  const avgReps = sumReps(previousWorkoutSets) / previousWorkoutSets.length;

  const avgWeight = averageWeight(previousWorkoutSets);

  if (newWeight <= 0) {
    return config.minReps;
  }

  const ratio = avgWeight / newWeight;
  const suggested = Math.round(avgReps * ratio);

  // limitar variação (evita sugestões absurdas)
  const MAX_CHANGE = 0.3;

  const min = Math.round(avgReps * (1 - MAX_CHANGE));
  const max = Math.round(avgReps * (1 + MAX_CHANGE));

  const clamped = Math.max(min, Math.min(max, suggested));

  return clamped < config.minReps ? config.minReps : clamped;
};

/**
 * 🤖 Sugere próxima carga
 */
export const suggestNextWeight = (
  previousWorkoutSets: WorkoutSet[],
  increment: number = 2,
): number => {
  const avgWeight = averageWeight(previousWorkoutSets);

  return Math.round((avgWeight + increment) * 2) / 2;
};

/**
 * 📊 Comparação detalhada (pra relatórios)
 */
export const compareWorkoutSets = (
  previousWorkoutSets: WorkoutSet[],
  currentWorkoutSets: WorkoutSet[],
): ProgressionComparison => {
  return {
    volumeDiff:
      calculateVolume(currentWorkoutSets) -
      calculateVolume(previousWorkoutSets),

    repsDiff: sumReps(currentWorkoutSets) - sumReps(previousWorkoutSets),

    rirDiff: averageRir(currentWorkoutSets) - averageRir(previousWorkoutSets),
  };
};
