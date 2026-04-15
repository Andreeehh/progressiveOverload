import React, { useState } from "react";
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

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApplyFilters: (filters: {
    searchText: string;
    selectedGroupIds: string[];
  }) => void;
  muscleGroups: MuscleGroup[];
  currentFilters: {
    searchText: string;
    selectedGroupIds: string[];
  };
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onDismiss,
  onApplyFilters,
  muscleGroups,
  currentFilters,
}) => {
  const [searchText, setSearchText] = useState(currentFilters.searchText);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    currentFilters.selectedGroupIds,
  );

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      searchText: searchText.trim(),
      selectedGroupIds,
    });
    onDismiss();
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedGroupIds([]);
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
