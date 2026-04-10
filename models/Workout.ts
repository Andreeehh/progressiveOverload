import {WorkoutExercise} from './WorkoutExercise'

export interface Workout {
  id: string;
  date: string;
  mesocycleId: string;
  exercises: WorkoutExercise[];
  isDeleted?: boolean;
}