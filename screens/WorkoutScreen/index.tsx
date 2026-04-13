import React, { useState } from "react";
import { globalStyles } from "../../theme";
import { View, FlatList, Alert } from "react-native";
import { Text, FAB, Button } from "react-native-paper";
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
import { WorkoutSetModal } from "../../components/WorkoutSetModal";
import { styles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export const WorkoutScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;

  const {
    data,
    removeExerciseFromWorkout,
    moveExercise,
    updateExerciseSets,
    getLastExerciseSets,
  } = useWorkoutContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);

  const workout = data.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <View style={globalStyles.container}>
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

  const handleOpenModal = (index: number) => {
    setSelectedExerciseIndex(index);
    setModalVisible(true);
  };

  const handleSaveSetModal = (sets: any[]) => {
    if (selectedExerciseIndex === null) return;

    const exercise = workout.exercises[selectedExerciseIndex];
    updateExerciseSets(workoutId, exercise.variationId, sets);
    setModalVisible(false);
    setSelectedExerciseIndex(null);
  };

  const allSetsFilled = workout.exercises.every((ex) =>
    ex.workoutSets.every((set) => set.reps > 0 && set.weight > 0),
  );

  const handleSaveWorkout = () => {
    if (!allSetsFilled) {
      Alert.alert(
        "Sets incompletos",
        "Todos os sets devem ter peso e reps preenchidos",
      );
      return;
    }

    Alert.alert("Treino salvo", "Treino foi salvo com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          // Aqui você pode adicionar lógica adicional, como retornar para a HomeScreen
        },
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
        onOpen={() => handleOpenModal(index)}
        onRemove={() => handleRemove(item.variationId)}
        onMoveUp={() => moveExercise(workoutId, index, index - 1)}
        onMoveDown={() => moveExercise(workoutId, index, index + 1)}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text variant="titleLarge" style={globalStyles.title}>
        Treino
      </Text>

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.variationId}
        renderItem={renderItem}
      />

      <Button
        mode="contained"
        onPress={handleSaveWorkout}
        disabled={!allSetsFilled}
        style={styles.saveButton}
      >
        Salvar Treino
      </Button>

      <FAB icon="plus" style={globalStyles.fab} onPress={handleAddExercise} />

      {selectedExerciseIndex !== null && (
        (() => {
          const exercise = workout.exercises[selectedExerciseIndex];
          const variation = mockVariations.find(
            (v) => v.id === exercise.variationId,
          );
          const lastSets = getLastExerciseSets(exercise.variationId);

          return (
            <WorkoutSetModal
              visible={modalVisible}
              defaultSets={variation?.defaultSets || 3}
              currentSets={exercise.workoutSets}
              lastWorkoutSets={lastSets}
              onSave={handleSaveSetModal}
              onClose={() => setModalVisible(false)}
            />
          );
        })()
      )}
    </View>
  );
};
