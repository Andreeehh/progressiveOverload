import React, { useState, useEffect } from "react";
import { View, FlatList, ScrollView } from "react-native";
import {
  Text,
  Modal,
  Portal,
  TextInput,
  Button,
  Chip,
} from "react-native-paper";
import { MuscleGroup } from "../../models/MuscleGroup";
import { Workout } from "../../models/Workout";

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApplyFilters: (filters: {
    searchText: string;
    selectedGroupIds: string[];
    selectedWorkoutId: string | undefined;
  }) => void;
  muscleGroups: MuscleGroup[];
  workouts: Workout[];
  currentFilters: {
    searchText: string;
    selectedGroupIds: string[];
    selectedWorkoutId: string | undefined;
  };
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onDismiss,
  onApplyFilters,
  muscleGroups,
  workouts,
  currentFilters,
}) => {
  const [searchText, setSearchText] = useState(currentFilters.searchText);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    currentFilters.selectedGroupIds,
  );
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<
    string | undefined
  >(currentFilters.selectedWorkoutId);

  // Atualizar estado quando currentFilters muda
  useEffect(() => {
    setSearchText(currentFilters.searchText);
    setSelectedGroupIds(currentFilters.selectedGroupIds);
    setSelectedWorkoutId(currentFilters.selectedWorkoutId);
  }, [visible, currentFilters]);

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const handleToggleWorkout = (workoutId: string) => {
    setSelectedWorkoutId(
      selectedWorkoutId === workoutId ? undefined : workoutId,
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      searchText: searchText.trim(),
      selectedGroupIds,
      selectedWorkoutId,
    });
    onDismiss();
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedGroupIds([]);
    setSelectedWorkoutId(undefined);
    // Aplicar os filtros limpos imediatamente
    onApplyFilters({
      searchText: "",
      selectedGroupIds: [],
      selectedWorkoutId: undefined,
    });
    onDismiss();
  };

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
          maxHeight: "80%",
        }}
      >
        <ScrollView>
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            Filtrar Exercícios
          </Text>

          {/* Search by name */}
          <TextInput
            label="Buscar por nome"
            value={searchText}
            onChangeText={setSearchText}
            style={{ marginBottom: 16 }}
            placeholder="Digite o nome do exercício..."
          />

          {/* Filter by muscle groups */}
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            Filtrar por Grupo Muscular
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {muscleGroups.map((group) => (
              <Chip
                key={group.id}
                selected={selectedGroupIds.includes(group.id)}
                onPress={() => handleToggleGroup(group.id)}
                style={{ marginBottom: 4 }}
              >
                {group.name}
              </Chip>
            ))}
          </View>

          {/* Filter by workouts */}
          {workouts.length > 0 && (
            <>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                Filtrar por Treino
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {workouts
                  .filter((w) => !w.isDeleted)
                  .map((workout) => (
                    <Chip
                      key={workout.id}
                      selected={selectedWorkoutId === workout.id}
                      onPress={() => handleToggleWorkout(workout.id)}
                      style={{ marginBottom: 4 }}
                    >
                      {workout.name}
                    </Chip>
                  ))}
              </View>
            </>
          )}

          {/* Action buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Button onPress={handleClearFilters} style={{ flex: 1 }}>
              Limpar
            </Button>
            <Button onPress={onDismiss} style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleApplyFilters}
              style={{ flex: 1 }}
            >
              Aplicar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
