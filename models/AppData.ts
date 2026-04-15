import { Workout } from "./Workout";
import { Exercise } from "./Exercise";
import { Mesocycle } from "./Mesocycle";
import { MuscleGroup } from "./MuscleGroup";

export interface AppData {
  workouts: Workout[];
  exercises: Exercise[];
  mesocycles: Mesocycle[];
  muscleGroups: MuscleGroup[];
}
