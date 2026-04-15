import React from "react";
import { Card, TextInput } from "react-native-paper";
import { WorkoutSet } from "../../models/WorkoutSet";
import { styles } from "./styles";

type Props = {
  workoutSet: WorkoutSet;
  onUpdate: (field: keyof WorkoutSet, value: number | string) => void;
};

export const WorkoutSetCard = ({ workoutSet, onUpdate }: Props) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <TextInput
          label="Peso (kg)"
          keyboardType="numeric"
          value={workoutSet.weight.toString()}
          onChangeText={(text) => onUpdate("weight", Number(text))}
          style={styles.input}
        />

        <TextInput
          label="Reps"
          keyboardType="numeric"
          value={workoutSet.reps.toString()}
          onChangeText={(text) => onUpdate("reps", Number(text))}
          style={styles.input}
        />

        <TextInput
          label="RIR (Reps in Reserve)"
          keyboardType="numeric"
          value={workoutSet.rir.toString()}
          onChangeText={(text) => onUpdate("rir", Number(text))}
          style={styles.input}
        />
      </Card.Content>
    </Card>
  );
};
