export interface WorkoutSet {
  reps: number;
  weight: number;
  rir: number; // reps in reserve (reps de sobra)
  performedAt?: string; // ISO date string of when the set was performed
}
