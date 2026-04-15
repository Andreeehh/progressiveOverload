import React from "react";
import { Card, Text, Button } from "react-native-paper";
import { Workout } from "../../models/Workout";
import { styles } from "./styles";

interface WorkoutCardProps {
  workout: Workout;
  onOpen: (workoutId: string) => void;
  onRemove: (workoutId: string) => void;
}

export const WorkoutCard = ({
  workout,
  onOpen,
  onRemove,
}: WorkoutCardProps) => {
  const date = new Date(workout.date).toLocaleDateString();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">Treino: {workout.name}</Text>
        <Text variant="bodyMedium">{date}</Text>
        <Text variant="bodySmall">{workout.exercises.length} exercícios</Text>
      </Card.Content>

      <Card.Actions>
        <Button onPress={() => onOpen(workout.id)}>Abrir</Button>
        <Button textColor="red" onPress={() => onRemove(workout.id)}>
          Remover
        </Button>
      </Card.Actions>
    </Card>
  );
};