import React from "react";
import { View, FlatList } from "react-native";
import { Text, Button, TextInput, Modal, Portal } from "react-native-paper";
import { Exercise } from "../../models/Exercise";
import { MuscleGroup } from "../../models/MuscleGroup";

type ExerciseWithGroup = Exercise & { groupName: string };

interface ExerciseModalProps {
  visible: boolean;
  onDismiss: () => void;
  editingExercise: ExerciseWithGroup | null;
  exerciseName: string;
  setExerciseName: (name: string) => void;
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  groupSearch: string;
  setGroupSearch: (search: string) => void;
  onSave: () => void;
  muscleGroups: MuscleGroup[];
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  onDismiss,
  editingExercise,
  exerciseName,
  setExerciseName,
  selectedGroupId,
  setSelectedGroupId,
  groupSearch,
  setGroupSearch,
  onSave,
  muscleGroups,
}) => {
  const filteredGroups = muscleGroups.filter((group) =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase()),
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
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

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            mode="contained"
            onPress={onSave}
            disabled={!exerciseName.trim() || !selectedGroupId}
          >
            Salvar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
