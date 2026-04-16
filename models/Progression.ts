export interface ProgressionResult {
  isValid: boolean;
  status: ProgressionStatus;
  reason: string;
  previousVolume: number;
  currentVolume: number;
  previousReps: number;
  currentReps: number;
}
export interface ProgressionComparison {
  volumeDiff: number;
  repsDiff: number;
  rirDiff: number;
}

/**
 * Configuração de regras de progressão
 */
export interface ProgressionConfig {
  minRepDropRatio: number; // ex: 0.85 = permite cair 15%
  minReps: number; // mínimo por série
}

export const PROGRESSION_STATUS = {
  FIRST_TIME: "FIRST_TIME",
  PROGRESSION: "PROGRESSION",
  NO_VOLUME_INCREASE: "NO_VOLUME_INCREASE",
  EXCESSIVE_REP_DROP: "EXCESSIVE_REP_DROP",
} as const;

export type ProgressionStatus = keyof typeof PROGRESSION_STATUS;
