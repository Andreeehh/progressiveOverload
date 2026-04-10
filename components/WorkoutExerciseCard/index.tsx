import React from "react";
import { View } from "react-native";
import { Card, Text, Button, IconButton } from "react-native-paper";
import { styles } from "./styles";
import { WorkoutExercise } from "../../models/WorkoutExercise";
import { useTheme } from "react-native-paper";

type Props = {
  item: WorkoutExercise;
  index: number;
  total: number;
  title: string;
  groupName?: string;
  onOpen: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export const WorkoutExerciseCard = ({
  item,
  index,
  total,
  title,
  groupName,
  onOpen,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) => {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {/* 🟢 ESQUERDA */}
        <View style={styles.left}>
          <Text variant="labelSmall">{groupName}</Text>
          <Text variant="titleMedium">{title}</Text>
          <Text variant="bodySmall">Sets: {item.workoutSets.length}</Text>
        </View>

        {/* 🔵 DIREITA */}
        <View style={styles.right}>
          {index > 0 && (
            <IconButton
              icon="arrow-up"
              size={26}
              style={styles.iconButton}
              onPress={onMoveUp}
            />
          )}

          {index < total - 1 && (
            <IconButton
              icon="arrow-down"
              size={26}
              style={styles.iconButton}
              onPress={onMoveDown}
            />
          )}
        </View>
      </View>

      <Card.Actions>
        <Button onPress={onOpen}>Abrir</Button>
        <Button textColor={theme.colors.error} onPress={onRemove}>
          Remover
        </Button>
      </Card.Actions>
    </Card>
  );
};
