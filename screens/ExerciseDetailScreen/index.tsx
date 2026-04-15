import React, { useState } from "react";
import { globalStyles } from "../../theme";
import { View, FlatList } from "react-native";
import { Text, TextInput, Button, Card, FAB } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { WorkoutSet } from "../../models/WorkoutSet";

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseDetail">;

export const ExerciseDetailScreen = ({ route }: Props) => {
  const { workoutId, variationId } = route.params;

  const { data, updateExerciseSets, checkProgression } = useWorkoutContext();

  const workout = data.workouts.find((w) => w.id === workoutId);

  const exercise = workout?.exercises.find(
    (ex) => ex.variationId === variationId,
  );

  const [sets, setSets] = useState<WorkoutSet[]>(exercise?.workoutSets || []);

  /**
   * ➕ adicionar set vazio
   */
  const addSet = () => {
    setSets((prev) => [...prev, { weight: 0, reps: 0, rir: 0 }]);
  };

  /**
   * ✏️ atualizar set
   */
  const updateSet = (
    index: number,
    field: "reps" | "weight" | "rir",
    value: number,
  ) => {
    const updated = [...sets];
    updated[index][field] = value;
    setSets(updated);
  };

  /**
   * 💾 salvar + validar progressão
   */
  const handleSave = () => {
    updateExerciseSets(workoutId, variationId, sets);

    const result = checkProgression(variationId, sets);

    console.log("Progressão:", result);
  };

  /**
   * 🎨 render set
   */
  const renderItem = ({ item, index }: { item: WorkoutSet; index: number }) => {
    return (
      <Card style={globalStyles.card}>
        <Card.Content>
          <Text>Set {index + 1}</Text>

          <TextInput
            label="Peso"
            keyboardType="numeric"
            value={item.weight.toString()}
            onChangeText={(text: string) =>
              updateSet(index, "weight", Number(text))
            }
          />

          <TextInput
            label="Reps"
            keyboardType="numeric"
            value={item.reps.toString()}
            onChangeText={(text: string) =>
              updateSet(index, "reps", Number(text))
            }
          />

          <TextInput
            label="RIR"
            keyboardType="numeric"
            value={item.rir.toString()}
            onChangeText={(text: string) =>
              updateSet(index, "rir", Number(text))
            }
          />
        </Card.Content>
      </Card>
    );
  };

  if (!exercise) {
    return (
      <View style={globalStyles.container}>
        <Text>Exercício não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text variant="titleLarge" style={globalStyles.title}>
        Sets
      </Text>

      <FlatList
        data={sets}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />

      <Button mode="contained" onPress={handleSave}>
        Salvar treino
      </Button>

      <FAB icon="plus" style={globalStyles.fab} onPress={addSet} />
    </View>
  );
};
