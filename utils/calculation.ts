import { WorkoutSet } from "../models/WorkoutSet";

function calculateVolume(sets: WorkoutSet[]): number {
  return sets.reduce((total, set) => total + set.reps * set.weight, 0);
}

function sumReps(sets: WorkoutSet[]): number {
  return sets.reduce((total, set) => total + set.reps, 0);
}

export function isProgressionValid(
  prevSets: WorkoutSet[],
  currentSets: WorkoutSet[],
): boolean {
  const prevVolume = calculateVolume(prevSets);
  const currentVolume = calculateVolume(currentSets);

  const prevReps = sumReps(prevSets);
  const currentReps = sumReps(currentSets);

  const MIN_REP_DROP = 0.85; // permite cair até 15%

  return currentVolume > prevVolume && currentReps >= prevReps * MIN_REP_DROP;
}
