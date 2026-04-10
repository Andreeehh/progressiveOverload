import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { WorkoutScreen } from "../screens/WorkoutScreen/WorkoutScreen";
import { ExerciseScreen } from "../screens/ExerciseScreen";
import { ExerciseDetailScreen } from "../screens/ExerciseDetailScreen";
import { MuscleGroupScreen } from "../screens/MuscleGroupScreen";

/**
 * Tipagem das rotas
 */
export type RootStackParamList = {
  Home: undefined;
  Workout: { workoutId: string };
  MuscleGroup: { workoutId: string };
  Exercise: { workoutId: string; muscleGroupId: string };
  ExerciseDetail: {
    workoutId: string;
    variationId: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Logbook" }}
        />

        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{ title: "Treino" }}
        />

        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
          options={{ title: "Exercícios" }}
        />

        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{ title: "Exercício" }}
        />
        <Stack.Screen
          name="MuscleGroup"
          component={MuscleGroupScreen}
          options={{ title: "Grupo Muscular" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
