import React from "react";
import { styles } from "./styles";
import { View, FlatList, Alert } from "react-native";
import { Text, FAB } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { WorkoutExercise } from "../../models/WorkoutExercise";

import { mockVariations } from "../../data/mockVariations";
import { mockExercises } from "../../data/mockExercises";
import { mockMuscleGroups } from "../../data/mockMuscleGroups";

import {
  getExerciseFullName,
  getExerciseDisplay,
} from "../../utils/exerciseUtils";

import { WorkoutExerciseCard } from "../../components/WorkoutExerciseCard";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export const WorkoutScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;

  const { data, removeExerciseFromWorkout, moveExercise } = useWorkoutContext();

  const workout = data.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Treino não encontrado</Text>
      </View>
    );
  }

  const handleAddExercise = () => {
    navigation.navigate("MuscleGroup", { workoutId });
  };

  const handleRemove = (variationId: string) => {
    Alert.alert("Remover exercício", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeExerciseFromWorkout(workoutId, variationId),
      },
    ]);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: WorkoutExercise;
    index: number;
  }) => {
    const variation = mockVariations.find((v) => v.id === item.variationId);

    const display = variation
      ? getExerciseDisplay(variation, mockExercises, mockMuscleGroups)
      : null;

    const title = variation
      ? getExerciseFullName(variation, mockExercises)
      : "Exercício";

    return (
      <WorkoutExerciseCard
        item={item}
        index={index}
        total={workout.exercises.length}
        title={title}
        groupName={display?.groupName}
        onOpen={() =>
          navigation.navigate("ExerciseDetail", {
            workoutId,
            variationId: item.variationId,
          })
        }
        onRemove={() => handleRemove(item.variationId)}
        onMoveUp={() => moveExercise(workoutId, index, index - 1)}
        onMoveDown={() => moveExercise(workoutId, index, index + 1)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Treino
      </Text>

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.variationId}
        renderItem={renderItem}
      />

      <FAB icon="plus" style={styles.fab} onPress={handleAddExercise} />
    </View>
  );
};
