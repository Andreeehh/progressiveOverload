import { Workout } from '../models/Workout';

export const mockWorkout: Workout = {
  id: '1',
  date: '2026-04-08',
  mesocycleId: 'meso1',
  exercises: [
    {
      variationId: '1', // 👈 Supino Reto
      workoutSets: [
        { reps: 10, weight: 40, rir: 2 },
        { reps: 10, weight: 40, rir: 1 },
        { reps: 9, weight: 40, rir: 0 },
      ],
    },
  ],
};