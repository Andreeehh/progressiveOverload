import React from "react";
import { View, FlatList, Alert } from "react-native";
import { Card, Text, Button, FAB } from "react-native-paper";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { Workout } from "../../models/Workout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen = ({ navigation }: Props) => {
  const { data, loading, addWorkout, removeWorkout } = useWorkoutContext();

  const handleCreateWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mesocycleId: "",
      exercises: [],
    };

    addWorkout(newWorkout);
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

  const renderItem = ({ item }: { item: Workout }) => {
    const date = new Date(item.date).toLocaleDateString();

    return (
      <Card style={{ marginBottom: 10 }}>
        <Card.Content>
          <Text variant="titleMedium">Treino</Text>
          <Text variant="bodyMedium">{date}</Text>
          <Text variant="bodySmall">{item.exercises.length} exercícios</Text>
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() =>
              navigation.navigate("Workout", {
                workoutId: item.id,
              })
            }
          >
            Abrir
          </Button>

          <Button textColor="red" onPress={() => handleRemove(item.id)}>
            Remover
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={[...data.workouts]
          .filter((w) => !w.isDeleted) // 🔥 não mostra soft deleted
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
        onPress={handleCreateWorkout}
      />
    </View>
  );
};
