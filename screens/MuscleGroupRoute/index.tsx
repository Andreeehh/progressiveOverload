import React, { useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text, FAB, Card, Button } from "react-native-paper";
import { globalStyles } from "../../theme";
import { MuscleGroup } from "../../models/MuscleGroup";
import { MuscleGroupModal } from "../../components/MuscleGroupModal";
import { useWorkoutContext } from "../../context/WorkoutContext";

export const MuscleGroupRoute = () => {
  const {
    muscleGroups,
    addMuscleGroup,
    updateMuscleGroup,
    removeMuscleGroup,
    isNameTaken,
  } = useWorkoutContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MuscleGroup | null>(null);
  const [groupName, setGroupName] = useState("");

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupName("");
    setModalVisible(true);
  };

  const handleEditGroup = (group: MuscleGroup) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setModalVisible(true);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;

    // Verificar se já existe um grupo com o mesmo nome
    if (isNameTaken(groupName.trim(), editingGroup?.id)) {
      Alert.alert(
        "Grupo já existe",
        "Já existe um grupo muscular com este nome.",
      );
      return;
    }

    if (editingGroup) {
      // Edit existing
      updateMuscleGroup(editingGroup.id, { name: groupName.trim() });
    } else {
      // Add new
      const newGroup: MuscleGroup = {
        id: Date.now().toString(),
        name: groupName.trim(),
      };
      addMuscleGroup(newGroup);
    }

    setModalVisible(false);
    setEditingGroup(null);
    setGroupName("");
  };

  const handleDeleteGroup = (groupId: string) => {
    Alert.alert(
      "Remover grupo",
      "Tem certeza que deseja remover este grupo muscular?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeMuscleGroup(groupId),
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: MuscleGroup }) => (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEditGroup(item)}>Editar</Button>
        <Button textColor="red" onPress={() => handleDeleteGroup(item.id)}>
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      <Text variant="titleLarge" style={globalStyles.title}>
        Grupos Musculares
      </Text>

      <FlatList
        data={muscleGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <FAB icon="plus" style={globalStyles.fab} onPress={handleAddGroup} />

      <MuscleGroupModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        editingGroup={editingGroup}
        groupName={groupName}
        setGroupName={setGroupName}
        onSave={handleSaveGroup}
      />
    </View>
  );
};
