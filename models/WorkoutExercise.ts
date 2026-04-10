import { WorkoutSet } from './WorkoutSet';

export interface WorkoutExercise {
  variationId: string;
  workoutSets: WorkoutSet[];
}
