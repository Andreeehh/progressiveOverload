import React, { useState } from "react";
import { globalStyles } from "../../theme";
import { View, FlatList, Alert } from "react-native";
import { List } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";

import { WorkoutExercise } from "../../models/WorkoutExercise";
import { ExerciseVariation } from "../../models/ExerciseVariation";
import { WorkoutSet } from "../../models/WorkoutSet";
import { Exercise } from "../../models/Exercise";
import { VariationModal } from "../../components/VariationModal";

type Props = NativeStackScreenProps<RootStackParamList, "Exercise">;

export const ExerciseScreen = ({ route, navigation }: Props) => {
  const { workoutId, muscleGroupId } = route.params;
  const { data, addExerciseToWorkout, exercises, exerciseVariations, addExerciseVariation } =
    useWorkoutContext();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  // Filter exercises by muscle group
  const filteredExercises = exercises.filter(
    (exercise) => exercise.muscleGroupId === muscleGroupId,
  );

  // Get existing variations for selected exercise
  const getExistingVariations = (exerciseId: string): ExerciseVariation[] => {
    return exerciseVariations.filter(
      (variation) => variation.exerciseId === exerciseId,
    );
  };

  /**
   * 📋 Abrir modal de variações
   */
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  /**
   * ✅ Selecionar variação existente
   */
  const handleSelectVariation = (variation: ExerciseVariation) => {
    const exists = data.workouts
      .find((w) => w.id === workoutId)
      ?.exercises.some((ex) => ex.variationId === variation.id);

    if (exists) {
      Alert.alert("Já adicionado", "Essa variação já está no treino.");
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
    setModalVisible(false);
    navigation.navigate("Workout", { workoutId });
  };

  /**
   * ➕ Criar nova variação
   */
  const handleCreateVariation = (
    variationName: string,
    defaultSets: number,
  ) => {
    if (!selectedExercise) return;

    // Create new variation
    const newVariation: ExerciseVariation = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      name: variationName,
      defaultSets,
    };

    // Add to exercise variations (persisted via context)
    addExerciseVariation(newVariation);

    // Select the newly created variation
    handleSelectVariation(newVariation);
  };

  return (
    <View style={globalStyles.container}>
      <FlatList<Exercise>
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Exercise }) => (
          <List.Item
            title={item.name}
            onPress={() => handleSelectExercise(item)}
          />
        )}
      />

      <VariationModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        exercise={selectedExercise}
        existingVariations={
          selectedExercise ? getExistingVariations(selectedExercise.id) : []
        }
        onSelectVariation={handleSelectVariation}
        onCreateVariation={handleCreateVariation}
      />
    </View>
  );
};
