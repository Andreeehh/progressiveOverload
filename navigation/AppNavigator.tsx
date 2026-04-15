import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import { WorkoutScreen } from "../screens/WorkoutScreen";

/**
 * Tipagem das rotas
 */
export type RootStackParamList = {
  Home: undefined;
  Workout: { workoutId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator id="main-stack">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
