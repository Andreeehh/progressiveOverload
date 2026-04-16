import { globalStyles } from "../../theme";
import { FlatList, View, Text, Alert } from "react-native";
import {
  FAB,
  Modal,
  Portal,
  TextInput,
  Button,
  Text as PaperText,
} from "react-native-paper";
import { WorkoutCard } from "../../components/WorkoutCard";
import { Workout } from "../../models/Workout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
export const WorkoutsRoute = ({
  navigation,
}: {
  navigation: Props["navigation"];
}) => {
  const { workouts, loading, addWorkout, removeWorkout } = useWorkoutContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");

  const handleCreateWorkout = () => {
    setModalVisible(true);
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) return;

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      date: new Date().toISOString(),
      mesocycleId: "",
      exercises: [],
    };

    addWorkout(newWorkout);
    setModalVisible(false);
    setWorkoutName("");
  };

  const handleCancelWorkout = () => {
    setModalVisible(false);
    setWorkoutName("");
  };

  const handleRemove = (workoutId: string) => {
    Alert.alert("Remover treino", "Tem certeza que deseja remover?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => removeWorkout(workoutId),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Workout }) => (
    <WorkoutCard
      workout={item}
      onOpen={(workoutId) => navigation.navigate("Workout", { workoutId })}
      onRemove={handleRemove}
    />
  );

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={[...workouts]
          .filter((w) => !w.isDeleted) // 🔥 não mostra soft deleted
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancelWorkout}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <PaperText variant="titleLarge" style={{ marginBottom: 16 }}>
            Novo Treino
          </PaperText>

          <TextInput
            label="Nome do Treino"
            value={workoutName}
            onChangeText={setWorkoutName}
            mode="outlined"
            style={{ marginBottom: 16 }}
            autoFocus
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button mode="outlined" onPress={handleCancelWorkout}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleSaveWorkout}>
              Criar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB icon="plus" style={globalStyles.fab} onPress={handleCreateWorkout} />
    </View>
  );
};
