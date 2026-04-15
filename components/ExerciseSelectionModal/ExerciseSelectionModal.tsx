import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Text, Modal, Portal, List, Button } from "react-native-paper";
import { Exercise } from "../../models/Exercise";
import { ExerciseVariation } from "../../models/ExerciseVariation";
import { VariationModal } from "../VariationModal";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  exercises: Exercise[];
  exerciseVariations: ExerciseVariation[];
  onSelectVariation: (variation: ExerciseVariation) => void;
  onCreateVariation: (
    exerciseId: string,
    variationName: string,
    defaultSets: number,
  ) => void;
  onNavigateBack?: () => void;
}

export const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  visible,
  onDismiss,
  exercises,
  exerciseVariations,
  onSelectVariation,
  onCreateVariation,
  onNavigateBack,
}) => {
  const [variationModalVisible, setVariationModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setVariationModalVisible(true);
  };

  const handleVariationSelect = (variation: ExerciseVariation) => {
    onSelectVariation(variation);
    setVariationModalVisible(false);
    onDismiss();
  };

  const handleCreateVariation = (
    variationName: string,
    defaultSets: number,
  ) => {
    if (!selectedExercise) return;
    onCreateVariation(selectedExercise.id, variationName, defaultSets);
    setVariationModalVisible(false);
    onDismiss();
  };

  const getExistingVariations = (exerciseId: string): ExerciseVariation[] => {
    return exerciseVariations.filter(
      (variation) => variation.exerciseId === exerciseId,
    );
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible && !variationModalVisible}
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
            Selecionar Exercício
          </Text>

          {exercises.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 32 }}>
              <Text
                variant="bodyMedium"
                style={{ marginBottom: 16, textAlign: "center" }}
              >
                Nenhum exercício criado para este grupo muscular. Crie um na
                tela inicial para começar.
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                <Button
                  onPress={() => {
                    onDismiss();
                    onNavigateBack?.();
                  }}
                >
                  Voltar
                </Button>
              </View>
            </View>
          ) : (
            <FlatList<Exercise>
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Exercise }) => (
                <List.Item
                  title={item.name}
                  onPress={() => handleSelectExercise(item)}
                />
              )}
            />
          )}
        </Modal>
      </Portal>

      <VariationModal
        visible={variationModalVisible}
        onDismiss={() => setVariationModalVisible(false)}
        exercise={selectedExercise}
        existingVariations={
          selectedExercise ? getExistingVariations(selectedExercise.id) : []
        }
        onSelectVariation={handleVariationSelect}
        onCreateVariation={handleCreateVariation}
      />
    </>
  );
};
