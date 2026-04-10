import { ExerciseVariation } from '../models/ExerciseVariation';

export const mockVariations: ExerciseVariation[] = [
  // Supino
  { id: '1', exerciseId: '1', name: 'Reto', defaultSets: 3 },
  { id: '2', exerciseId: '1', name: 'Inclinado', defaultSets: 3 },
  { id: '3', exerciseId: '1', name: 'Máquina', defaultSets: 3 },

  // Agachamento
  { id: '4', exerciseId: '2', name: 'Livre', defaultSets: 4 },
  { id: '5', exerciseId: '2', name: 'Smith', defaultSets: 4 },

  // Puxada
  { id: '6', exerciseId: '3', name: 'Frente', defaultSets: 3 },
  { id: '7', exerciseId: '3', name: 'Triângulo', defaultSets: 3 },

  // Desenvolvimento
  { id: '8', exerciseId: '4', name: 'Halter', defaultSets: 3 },
  { id: '9', exerciseId: '4', name: 'Barra', defaultSets: 3 },
];