import React, { useState, useLayoutEffect } from "react";
import { globalStyles } from "../../theme";
import { View, FlatList, Alert } from "react-native";
import { Text, FAB, Button, IconButton } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { WorkoutExercise } from "../../models/WorkoutExercise";
import { MuscleGroup } from "../../models/MuscleGroup";
import { WorkoutSet } from "../../models/WorkoutSet";

import {
  getExerciseFullName,
  getExerciseDisplay,
} from "../../utils/exerciseUtils";

import { WorkoutExerciseCard } from "../../components/WorkoutExerciseCard";
import { WorkoutSetModal } from "../../components/WorkoutSetModal";
import { MuscleGroupSelectionModal } from "../../components/MuscleGroupSelectionModal";
import { ExerciseSelectionModal } from "../../components/ExerciseSelectionModal";
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
    completeWorkout,
    exerciseVariations,
    exercises,
    muscleGroups,
    addExerciseToWorkout,
    addExerciseVariation,
  } = useWorkoutContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [muscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup | null>(null);

  const workout = data.workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <View style={globalStyles.container}>
        <Text>Treino não encontrado</Text>
      </View>
    );
  }

  const handleAddExercise = () => {
    setMuscleGroupModalVisible(true);
  };

  const handleSelectMuscleGroup = (muscleGroup: MuscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
    setExerciseModalVisible(true);
  };

  const handleBackToMuscleGroupModal = () => {
    setExerciseModalVisible(false);
    setSelectedMuscleGroup(null);
  };

  const handleNavigateToCreateMuscleGroup = () => {
    setMuscleGroupModalVisible(false);
    navigation.navigate("Home");
  };

  const handleSelectVariation = (variation: any) => {
    const variationId =
      typeof variation === "string" ? variation : variation.id;
    const exists = workout.exercises.some(
      (ex) => ex.variationId === variationId,
    );

    if (exists) {
      Alert.alert("Já adicionado", "Essa variação já está no treino.");
      return;
    }

    const selectedVariation =
      typeof variation === "string"
        ? exerciseVariations.find((v) => v.id === variationId)
        : variation;

    if (!selectedVariation) return;

    const sets: WorkoutSet[] = Array.from(
      { length: selectedVariation.defaultSets },
      () => ({
        weight: 0,
        reps: 0,
        rir: 0,
      }),
    );

    const newExercise: WorkoutExercise = {
      variationId: variationId,
      workoutSets: sets,
    };

    addExerciseToWorkout(workoutId, newExercise);
    setExerciseModalVisible(false);
    setSelectedMuscleGroup(null);
  };

  const handleCreateVariation = (
    exerciseId: string,
    variationName: string,
    defaultSets: number,
  ) => {
    const newVariation = {
      id: Date.now().toString(),
      exerciseId,
      name: variationName,
      defaultSets,
    };

    addExerciseVariation(newVariation);
    handleSelectVariation(newVariation.id);
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

    completeWorkout(workoutId);

    Alert.alert("Treino salvo", "Treino foi salvo com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("Home");
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
    const variation = exerciseVariations.find((v) => v.id === item.variationId);

    const display = variation
      ? getExerciseDisplay(variation, exercises, muscleGroups)
      : null;

    const title = variation
      ? getExerciseFullName(variation, exercises)
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

      {selectedExerciseIndex !== null &&
        (() => {
          const exercise = workout.exercises[selectedExerciseIndex];
          const variation = exerciseVariations.find(
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
        })()}

      <MuscleGroupSelectionModal
        visible={muscleGroupModalVisible}
        onDismiss={() => setMuscleGroupModalVisible(false)}
        muscleGroups={muscleGroups}
        onSelectMuscleGroup={handleSelectMuscleGroup}
        onNavigateToCreate={handleNavigateToCreateMuscleGroup}
      />

      {selectedMuscleGroup && (
        <ExerciseSelectionModal
          visible={exerciseModalVisible}
          onDismiss={handleBackToMuscleGroupModal}
          exercises={exercises.filter(
            (ex) => ex.muscleGroupId === selectedMuscleGroup.id,
          )}
          exerciseVariations={exerciseVariations}
          onSelectVariation={handleSelectVariation}
          onCreateVariation={handleCreateVariation}
          onNavigateBack={handleBackToMuscleGroupModal}
        />
      )}
    </View>
  );
};
