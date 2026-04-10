export interface Mesocycle {
  id: string;
  name: string; // ex: "Hipertrofia Abril"
  startDate: string; // ISO string
  endDate?: string;

  /**
   * Opcional: divisão de treino (ABC, Upper/Lower, etc)
   */
  split?: string;

  /**
   * Exercícios planejados no mesociclo
   */
  exerciseIds?: string[];
}