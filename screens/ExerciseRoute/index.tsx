import React, { useState } from "react";
import { View, FlatList } from "react-native";
import {
  Text,
  FAB,
  Card,
  Button,
  TextInput,
  Modal,
  Portal,
} from "react-native-paper";
import { globalStyles } from "../../theme";
import { mockExercises } from "../../data/mockExercises";
import { mockMuscleGroups } from "../../data/mockMuscleGroups";
import { Exercise } from "../../models/Exercise";
import { MuscleGroup } from "../../models/MuscleGroup";

type ExerciseWithGroup = Exercise & { groupName: string };

export const ExerciseRoute = () => {
  const [exercises, setExercises] = useState<ExerciseWithGroup[]>(() =>
    mockExercises.map((exercise) => ({
      ...exercise,
      groupName:
        mockMuscleGroups.find((g) => g.id === exercise.muscleGroupId)?.name ||
        "Desconhecido",
    })),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<ExerciseWithGroup | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  const filteredGroups = mockMuscleGroups.filter((group) =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase()),
  );

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
      mockMuscleGroups.find((g) => g.id === exercise.muscleGroupId)?.name || "",
    );
    setModalVisible(true);
  };

  const handleSaveExercise = () => {
    if (!exerciseName.trim() || !selectedGroupId) return;

    if (editingExercise) {
      // Edit existing
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise.id
            ? {
                ...ex,
                name: exerciseName.trim(),
                muscleGroupId: selectedGroupId,
                groupName:
                  mockMuscleGroups.find((g) => g.id === selectedGroupId)
                    ?.name || "Desconhecido",
              }
            : ex,
        ),
      );
    } else {
      // Add new
      const newExercise: ExerciseWithGroup = {
        id: Date.now().toString(),
        name: exerciseName.trim(),
        muscleGroupId: selectedGroupId,
        groupName:
          mockMuscleGroups.find((g) => g.id === selectedGroupId)?.name ||
          "Desconhecido",
      };
      setExercises((prev) => [...prev, newExercise]);
    }

    setModalVisible(false);
    setEditingExercise(null);
    setExerciseName("");
    setSelectedGroupId("");
    setGroupSearch("");
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const renderItem = ({ item }: { item: ExerciseWithGroup }) => (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodyMedium">{item.groupName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEditExercise(item)}>Editar</Button>
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

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            {editingExercise ? "Editar Exercício" : "Novo Exercício"}
          </Text>

          <TextInput
            label="Nome do Exercício"
            value={exerciseName}
            onChangeText={setExerciseName}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            label="Grupo Muscular"
            value={groupSearch}
            onChangeText={setGroupSearch}
            style={{ marginBottom: 16 }}
          />

          {filteredGroups.length > 0 && (
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Button
                  mode={selectedGroupId === item.id ? "contained" : "outlined"}
                  onPress={() => {
                    setSelectedGroupId(item.id);
                    setGroupSearch(item.name);
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {item.name}
                </Button>
              )}
              style={{ maxHeight: 200, marginBottom: 16 }}
            />
          )}

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            <Button
              mode="contained"
              onPress={handleSaveExercise}
              disabled={!exerciseName.trim() || !selectedGroupId}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
