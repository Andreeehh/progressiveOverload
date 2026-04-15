import React from "react";
import { View, Text } from "react-native";
import { Card, IconButton, TextInput } from "react-native-paper";
import { WorkoutSet } from "../../models/WorkoutSet";
import { styles } from "./styles";

type Props = {
  workoutSet: WorkoutSet;
  onUpdate: (field: keyof WorkoutSet, value: number | string) => void;
};

export const WorkoutSetCard = ({ workoutSet, onUpdate }: Props) => {
  const updateValue = (field: keyof WorkoutSet, delta: number) => {
    const currentValue = workoutSet[field] as number;
    const newValue = Math.max(0, Math.min(500, currentValue + delta));
    onUpdate(field, newValue);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Peso (kg)</Text>
          <View style={styles.inputRow}>
            <IconButton
              icon="minus"
              onPress={() => updateValue("weight", -1)}
            />
            <TextInput
              value={workoutSet.weight.toString()}
              onChangeText={(text) => onUpdate("weight", Number(text) || 0)}
              style={styles.valueInput}
              keyboardType="numeric"
            />
            <IconButton icon="plus" onPress={() => updateValue("weight", 1)} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Reps</Text>
          <View style={styles.inputRow}>
            <IconButton icon="minus" onPress={() => updateValue("reps", -1)} />
            <TextInput
              value={workoutSet.reps.toString()}
              onChangeText={(text) => onUpdate("reps", Number(text) || 0)}
              style={styles.valueInput}
              keyboardType="numeric"
            />
            <IconButton icon="plus" onPress={() => updateValue("reps", 1)} />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>RIR (Reps in Reserve)</Text>
          <View style={styles.inputRow}>
            <IconButton icon="minus" onPress={() => updateValue("rir", -1)} />
            <TextInput
              value={workoutSet.rir.toString()}
              onChangeText={(text) => onUpdate("rir", Number(text) || 0)}
              style={styles.valueInput}
              keyboardType="numeric"
            />
            <IconButton icon="plus" onPress={() => updateValue("rir", 1)} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
