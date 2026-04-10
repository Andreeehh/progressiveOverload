import React from "react";
import { globalStyles } from "../../theme";
import { View, FlatList, Alert } from "react-native";
import { List } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";

import { mockVariations } from "../../data/mockVariations";
import { mockExercises } from "../../data/mockExercises";
import { getExerciseFullName } from "../../utils/exerciseUtils";

import { WorkoutExercise } from "../../models/WorkoutExercise";
import { ExerciseVariation } from "../../models/ExerciseVariation";
import { WorkoutSet } from "../../models/WorkoutSet";

type Props = NativeStackScreenProps<RootStackParamList, "Exercise">;

export const ExerciseScreen = ({ route, navigation }: Props) => {
  const { workoutId, muscleGroupId } = route.params;
  const { data, addExerciseToWorkout } = useWorkoutContext();

  const filteredVariations = mockVariations.filter((variation) => {
    const exercise = mockExercises.find((e) => e.id === variation.exerciseId);

    return exercise?.muscleGroupId === muscleGroupId;
  });

  /**
   * ➕ Selecionar exercício
   */
  const handleSelectExercise = (variation: ExerciseVariation) => {
    const exists = data.workouts
      .find((w) => w.id === workoutId)
      ?.exercises.some((ex) => ex.variationId === variation.id);

    if (exists) {
      Alert.alert("Já adicionado", "Esse exercício já está no treino.");
      return;
    }

    const sets: WorkoutSet[] = Array.from(
      { length: variation.defaultSets },
      () => ({
        weight: 0,
        reps: 0,
        rir: 0,
      }),
    );

    const newExercise: WorkoutExercise = {
      variationId: variation.id,
      workoutSets: sets,
    };

    addExerciseToWorkout(workoutId, newExercise);

    navigation.navigate("Workout", { workoutId });
  };

  return (
    <View style={globalStyles.container}>
      <FlatList<ExerciseVariation>
        data={filteredVariations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: ExerciseVariation }) => (
          <List.Item
            title={getExerciseFullName(item, mockExercises)}
            onPress={() => handleSelectExercise(item)}
          />
        )}
      />
    </View>
  );
};
