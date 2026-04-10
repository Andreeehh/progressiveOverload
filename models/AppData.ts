import {Workout} from './Workout';
import {Exercise} from './Exercise';
import {Mesocycle} from './Mesocycle';

export interface AppData {
  workouts: Workout[];
  exercises: Exercise[];
  mesocycles: Mesocycle[];
}