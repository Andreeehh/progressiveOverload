import React from "react";
import { View } from "react-native";
import { Text, Button, TextInput, Modal, Portal } from "react-native-paper";
import { MuscleGroup } from "../../models/MuscleGroup";

interface MuscleGroupModalProps {
  visible: boolean;
  onDismiss: () => void;
  editingGroup: MuscleGroup | null;
  groupName: string;
  setGroupName: (name: string) => void;
  onSave: () => void;
}

export const MuscleGroupModal: React.FC<MuscleGroupModalProps> = ({
  visible,
  onDismiss,
  editingGroup,
  groupName,
  setGroupName,
  onSave,
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
        }}
      >
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          {editingGroup ? "Editar Grupo Muscular" : "Novo Grupo Muscular"}
        </Text>

        <TextInput
          label="Nome do Grupo Muscular"
          value={groupName}
          onChangeText={setGroupName}
          style={{ marginBottom: 16 }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            mode="contained"
            onPress={onSave}
            disabled={!groupName.trim()}
          >
            Salvar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
