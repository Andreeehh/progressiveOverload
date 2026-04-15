import { globalStyles } from "../../theme";
import { FlatList, View, Text, Alert } from "react-native";
import { FAB } from "react-native-paper";
import { HomeScreenCard } from "../../components/HomeScreenCard";
import { Workout } from "../../models/Workout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
export const WorkoutsRoute = ({
  navigation,
}: {
  navigation: Props["navigation"];
}) => {
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

  const renderItem = ({ item }: { item: Workout }) => (
    <HomeScreenCard
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
        data={[...data.workouts]
          .filter((w) => !w.isDeleted) // 🔥 não mostra soft deleted
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <FAB icon="plus" style={globalStyles.fab} onPress={handleCreateWorkout} />
    </View>
  );
};
