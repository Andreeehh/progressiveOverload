import { Workout } from "./Workout";
import { Exercise } from "./Exercise";
import { Mesocycle } from "./Mesocycle";
import { MuscleGroup } from "./MuscleGroup";
import { WorkoutExecution } from "./WorkoutExecution";
import { ExerciseVariation } from "./ExerciseVariation";

export interface AppData {
  workouts: Workout[];
  exercises: Exercise[];
  exerciseVariations: ExerciseVariation[];
  mesocycles: Mesocycle[];
  muscleGroups: MuscleGroup[];
  workoutExecutions: WorkoutExecution[];
}
