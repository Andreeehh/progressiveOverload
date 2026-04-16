import React, { useState } from "react";
import { globalStyles } from "../../theme";
import { View, FlatList, Alert } from "react-native";
import { Text, FAB, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { WorkoutExercise } from "../../models/WorkoutExercise";
import { MuscleGroup } from "../../models/MuscleGroup";
import { WorkoutSet } from "../../models/WorkoutSet";
import { ExerciseVariation } from "../../models/ExerciseVariation";
import { Exercise } from "../../models/Exercise";

import {
  getExerciseFullName,
  getExerciseDisplay,
} from "../../utils/exerciseUtils";

import { WorkoutExerciseCard } from "../../components/WorkoutExerciseCard";
import { WorkoutSetModal } from "../../components/WorkoutSetModal";
import { MuscleGroupSelectionModal } from "../../components/MuscleGroupSelectionModal";
import { ExerciseSelectionModal } from "../../components/ExerciseSelectionModal";
import { ProgressionAnalysisModal } from "../../components/ProgressionAnalysisModal";
import { validateProgression } from "../../services/progressionService";
import { ProgressionResult } from "../../models/Progression";
import { styles } from "./styles";
import { Workout } from "../../models/Workout";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export const WorkoutScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;

  const {
    workouts,
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
  const [progressionModalVisible, setProgressionModalVisible] = useState(false);
  const [progressionResult, setProgressionResult] =
    useState<ProgressionResult | null>(null);

  const workout = workouts.find((w: Workout) => w.id === workoutId);

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

  const handleSelectVariation = (variation: string | ExerciseVariation) => {
    const variationId =
      typeof variation === "string" ? variation : variation.id;
    const selectedVariation =
      typeof variation === "string"
        ? exerciseVariations.find(
            (v: ExerciseVariation) => v.id === variationId,
          )
        : variation;

    if (!selectedVariation) return;

    const exists = workout.exercises.some(
      (ex: WorkoutExercise) => ex.variationId === variationId,
    );

    if (exists) {
      Alert.alert("Já adicionado", "Essa variação já está no treino.");
      return;
    }

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
    handleSelectVariation(newVariation);
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

  const allSetsFilled = workout.exercises.every((ex: WorkoutExercise) =>
    ex.workoutSets.every((set: WorkoutSet) => set.reps > 0),
  );

  const handleSaveWorkout = () => {
    if (!allSetsFilled) {
      Alert.alert(
        "Sets incompletos",
        "Todos os sets devem ter peso e reps preenchidos",
      );
      return;
    }

    // Validar progressão para cada exercício
    let hasInvalidProgression = false;
    let firstInvalidResult: ProgressionResult | null = null;

    for (const exercise of workout.exercises) {
      const lastSets = getLastExerciseSets(exercise.variationId);
      if (lastSets && lastSets.length > 0) {
        const result = validateProgression(lastSets, exercise.workoutSets);
        if (!result.isValid) {
          hasInvalidProgression = true;
          if (!firstInvalidResult) {
            firstInvalidResult = result;
          }
        }
      }
    }

    if (hasInvalidProgression && firstInvalidResult) {
      setProgressionResult(firstInvalidResult);
      setProgressionModalVisible(true);
      return;
    }

    // Se não há problemas de progressão ou é primeira vez, salvar diretamente
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

  const handleConfirmSaveWorkout = () => {
    setProgressionModalVisible(false);
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

  const handleDismissProgressionModal = () => {
    setProgressionModalVisible(false);
    setProgressionResult(null);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: WorkoutExercise;
    index: number;
  }) => {
    const variation = exerciseVariations.find(
      (v: ExerciseVariation) => v.id === item.variationId,
    );

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
        {workout.name}
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
            (v: ExerciseVariation) => v.id === exercise.variationId,
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
            (ex: Exercise) => ex.muscleGroupId === selectedMuscleGroup.id,
          )}
          exerciseVariations={exerciseVariations}
          onSelectVariation={handleSelectVariation}
          onCreateVariation={handleCreateVariation}
          onNavigateBack={handleBackToMuscleGroupModal}
        />
      )}

      <ProgressionAnalysisModal
        visible={progressionModalVisible}
        onDismiss={handleDismissProgressionModal}
        onConfirm={handleConfirmSaveWorkout}
        progressionResult={progressionResult}
      />
    </View>
  );
};
