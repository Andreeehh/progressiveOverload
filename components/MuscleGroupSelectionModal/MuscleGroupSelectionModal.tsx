import React from "react";
import { View, FlatList } from "react-native";
import { Text, Modal, Portal, List, Button } from "react-native-paper";
import { MuscleGroup } from "../../models/MuscleGroup";

interface MuscleGroupSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  muscleGroups: MuscleGroup[];
  onSelectMuscleGroup: (muscleGroup: MuscleGroup) => void;
  onNavigateToCreate?: () => void;
}

export const MuscleGroupSelectionModal: React.FC<
  MuscleGroupSelectionModalProps
> = ({
  visible,
  onDismiss,
  muscleGroups,
  onSelectMuscleGroup,
  onNavigateToCreate,
}) => {
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
          Selecionar Grupo Muscular
        </Text>

        {muscleGroups.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 32 }}>
            <Text
              variant="bodyMedium"
              style={{ marginBottom: 16, textAlign: "center" }}
            >
              Nenhum grupo muscular criado. Crie um na tela inicial para começar.
            </Text>
            <View
              style={{ flexDirection: "row", gap: 8, marginTop: 16 }}
            >
              <Button onPress={onDismiss}>Voltar</Button>
              {onNavigateToCreate && (
                <Button mode="contained" onPress={onNavigateToCreate}>
                  Criar Grupo Muscular
                </Button>
              )}
            </View>
          </View>
        ) : (
          <FlatList<MuscleGroup>
            data={muscleGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: MuscleGroup }) => (
              <List.Item
                title={item.name}
                onPress={() => {
                  onSelectMuscleGroup(item);
                  onDismiss();
                }}
              />
            )}
          />
        )}
      </Modal>
    </Portal>
  );
};
