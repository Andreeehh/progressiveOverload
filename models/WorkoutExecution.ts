import { WorkoutSet } from "./WorkoutSet";

export interface WorkoutExecution {
  id: string;
  variationId: string;
  workoutSets: WorkoutSet[];
  date: string;
}
