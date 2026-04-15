import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppData } from "../models/AppData";

const KEY = "logbook";

export const saveData = async (data: AppData): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados", error);
    throw error;
  }
};

export const loadData = async (): Promise<AppData> => {
  try {
    const data = await AsyncStorage.getItem(KEY);

    if (!data) {
      return {
        workouts: [],
        exercises: [],
        mesocycles: [],
        muscleGroups: [],
        workoutExecutions: [],
      };
    }

    const parsed = JSON.parse(data) as AppData & { workoutExecutions?: any };

    return {
      ...parsed,
      workoutExecutions: parsed.workoutExecutions ?? [],
    };
  } catch (error) {
    console.error("Erro ao carregar dados", error);

    return {
      workouts: [],
      exercises: [],
      mesocycles: [],
      muscleGroups: [],
      workoutExecutions: [],
    };
  }
};

export const clearData = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};
