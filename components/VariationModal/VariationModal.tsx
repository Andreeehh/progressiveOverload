import React, { useState } from "react";
import { View, FlatList } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Modal,
  Portal,
  List,
} from "react-native-paper";
import { Exercise } from "../../models/Exercise";
import { ExerciseVariation } from "../../models/ExerciseVariation";

interface VariationModalProps {
  visible: boolean;
  onDismiss: () => void;
  exercise: Exercise | null;
  existingVariations: ExerciseVariation[];
  onSelectVariation: (variation: ExerciseVariation) => void;
  onCreateVariation: (variationName: string, defaultSets: number) => void;
}

export const VariationModal: React.FC<VariationModalProps> = ({
  visible,
  onDismiss,
  exercise,
  existingVariations,
  onSelectVariation,
  onCreateVariation,
}) => {
  const [newVariationName, setNewVariationName] = useState("");
  const [defaultSets, setDefaultSets] = useState("3");

  const handleCreateVariation = () => {
    if (!newVariationName.trim()) return;

    const sets = parseInt(defaultSets) || 3;
    onCreateVariation(newVariationName.trim(), sets);

    // Reset form and close modal
    setNewVariationName("");
    setDefaultSets("3");
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
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Selecionar Variação - {exercise?.name}
        </Text>

        {/* Existing Variations */}
        {existingVariations.length > 0 && (
          <>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              Variações Existentes:
            </Text>
            <FlatList
              data={existingVariations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={`${item.name} (${item.defaultSets} séries)`}
                  onPress={() => onSelectVariation(item)}
                  style={{ paddingHorizontal: 0 }}
                />
              )}
              style={{ maxHeight: 200, marginBottom: 16 }}
            />
          </>
        )}

        {/* Create New Variation */}
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Criar Nova Variação:
        </Text>

        <TextInput
          label="Nome da Variação"
          value={newVariationName}
          onChangeText={setNewVariationName}
          style={{ marginBottom: 8 }}
        />

        <TextInput
          label="Séries Padrão"
          value={defaultSets}
          onChangeText={setDefaultSets}
          keyboardType="numeric"
          style={{ marginBottom: 16 }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            mode="contained"
            onPress={handleCreateVariation}
            disabled={!newVariationName.trim()}
          >
            Criar e Selecionar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
