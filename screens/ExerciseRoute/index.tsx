import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Text, FAB, Card, Button } from "react-native-paper";
import { globalStyles } from "../../theme";
import { Exercise } from "../../models/Exercise";
import { MuscleGroup } from "../../models/MuscleGroup";
import { ExerciseModal } from "../../components/ExerciseModal";
import { ProgressionReportModal } from "../../components/ProgressionReportModal";
import { useWorkoutContext } from "../../context/WorkoutContext";

type ExerciseWithGroup = Exercise & { groupName: string };

export const ExerciseRoute = () => {
  const {
    exercises: rawExercises,
    addExercise,
    updateExercise,
    removeExercise,
    muscleGroups,
    data,
  } = useWorkoutContext();

  // Combine exercises with group names
  const exercises: ExerciseWithGroup[] = rawExercises.map((exercise) => ({
    ...exercise,
    groupName:
      muscleGroups.find((g) => g.id === exercise.muscleGroupId)?.name ||
      "Desconhecido",
  }));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<ExerciseWithGroup | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  // Progression report state
  const [reportVisible, setReportVisible] = useState(false);
  const [selectedExerciseForReport, setSelectedExerciseForReport] =
    useState<Exercise | null>(null);

  const handleAddExercise = () => {
    setEditingExercise(null);
    setExerciseName("");
    setSelectedGroupId("");
    setGroupSearch("");
    setModalVisible(true);
  };

  const handleEditExercise = (exercise: ExerciseWithGroup) => {
    setEditingExercise(exercise);
    setExerciseName(exercise.name);
    setSelectedGroupId(exercise.muscleGroupId);
    setGroupSearch(
      muscleGroups.find((g) => g.id === exercise.muscleGroupId)?.name || "",
    );
    setModalVisible(true);
  };

  const handleSaveExercise = () => {
    if (!exerciseName.trim() || !selectedGroupId) return;

    if (editingExercise) {
      // Edit existing
      updateExercise(editingExercise.id, {
        name: exerciseName.trim(),
        muscleGroupId: selectedGroupId,
      });
    } else {
      // Add new
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName.trim(),
        muscleGroupId: selectedGroupId,
      };
      addExercise(newExercise);
    }

    setModalVisible(false);
    setEditingExercise(null);
    setExerciseName("");
    setSelectedGroupId("");
    setGroupSearch("");
  };

  const handleDeleteExercise = (exerciseId: string) => {
    removeExercise(exerciseId);
  };

  const handleOpenReport = (exercise: Exercise) => {
    setSelectedExerciseForReport(exercise);
    setReportVisible(true);
  };

  const renderItem = ({ item }: { item: ExerciseWithGroup }) => (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodyMedium">{item.groupName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEditExercise(item)}>Editar</Button>
        <Button onPress={() => handleOpenReport(item)}>Relatório</Button>
        <Button textColor="red" onPress={() => handleDeleteExercise(item.id)}>
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      <Text variant="titleLarge" style={globalStyles.title}>
        Exercícios
      </Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <FAB icon="plus" style={globalStyles.fab} onPress={handleAddExercise} />

      <ExerciseModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        editingExercise={editingExercise}
        exerciseName={exerciseName}
        setExerciseName={setExerciseName}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        groupSearch={groupSearch}
        setGroupSearch={setGroupSearch}
        onSave={handleSaveExercise}
        muscleGroups={muscleGroups}
      />

      <ProgressionReportModal
        visible={reportVisible}
        onDismiss={() => setReportVisible(false)}
        exercise={selectedExerciseForReport}
        workoutExecutions={data.workoutExecutions}
      />
    </View>
  );
};
