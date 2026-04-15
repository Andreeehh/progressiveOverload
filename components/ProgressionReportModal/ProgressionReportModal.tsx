import React, { useState } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { Text, Modal, Portal, Button, Card } from "react-native-paper";
import { Exercise } from "../../models/Exercise";
import { ExerciseVariation } from "../../models/ExerciseVariation";
import { WorkoutExecution } from "../../models/WorkoutExecution";

interface ProgressionReportModalProps {
  visible: boolean;
  onDismiss: () => void;
  exercise: Exercise | null;
  workoutExecutions: WorkoutExecution[];
  exerciseVariations: ExerciseVariation[];
}

interface WorkoutHistory {
  workoutDate: string;
  maxWeight: number;
  totalReps: number;
  setCount: number;
}

export const ProgressionReportModal: React.FC<ProgressionReportModalProps> = ({
  visible,
  onDismiss,
  exercise,
  workoutExecutions,
  exerciseVariations,
}) => {
  const [expandedVariationId, setExpandedVariationId] = useState<string | null>(
    null,
  );
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(
    null,
  );

  if (!exercise) return null;

  // Get all variations for this exercise
  const variationsForExercise = exerciseVariations.filter(
    (v) => v.exerciseId === exercise.id,
  );

  // Get history for a specific variation
  const getVariationHistory = (variationId: string): WorkoutHistory[] => {
    const history: WorkoutHistory[] = [];

    workoutExecutions.forEach((execution) => {
      if (execution.variationId !== variationId) return;

      const maxWeight = Math.max(...execution.workoutSets.map((s) => s.weight));
      const totalReps = execution.workoutSets.reduce(
        (sum, s) => sum + s.reps,
        0,
      );

      history.push({
        workoutDate: execution.date,
        maxWeight,
        totalReps,
        setCount: execution.workoutSets.length,
      });
    });

    // Sort by date descending (most recent first)
    return history.sort(
      (a, b) =>
        new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime(),
    );
  };

  // Get detailed sets for a specific variation on a specific date
  const getWorkoutSets = (variationId: string, workoutDate: string) => {
    const execution = workoutExecutions.find(
      (exec) => exec.variationId === variationId && exec.date === workoutDate,
    );
    return execution?.workoutSets || [];
  };

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
          maxHeight: "90%",
        }}
      >
        <ScrollView>
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            Relatório de Progressão - {exercise.name}
          </Text>

          {exerciseVariations.length === 0 ? (
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Nenhuma variação encontrada para este exercício.
            </Text>
          ) : (
            <FlatList
              data={variationsForExercise}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: variation }) => {
                const history = getVariationHistory(variation.id);
                const isExpanded = expandedVariationId === variation.id;

                return (
                  <Card
                    style={{ marginBottom: 12 }}
                    onPress={() =>
                      setExpandedVariationId(isExpanded ? null : variation.id)
                    }
                  >
                    <Card.Content>
                      <Text variant="titleMedium">{variation.name}</Text>
                      <Text variant="bodySmall">
                        Execuções: {history.length}
                      </Text>
                      {history.length > 0 && (
                        <Text variant="bodySmall">
                          Carga máxima: {history[0].maxWeight}kg
                        </Text>
                      )}
                    </Card.Content>

                    {isExpanded && history.length > 0 && (
                      <Card.Content>
                        <Text
                          variant="labelMedium"
                          style={{ marginTop: 8, marginBottom: 8 }}
                        >
                          Histórico:
                        </Text>
                        <FlatList
                          data={history}
                          keyExtractor={(item) => item.workoutDate}
                          scrollEnabled={false}
                          renderItem={({ item: workout }) => {
                            const isExpanded =
                              expandedWorkoutId ===
                              `${variation.id}-${workout.workoutDate}`;
                            const sets = getWorkoutSets(
                              variation.id,
                              workout.workoutDate,
                            );

                            return (
                              <View
                                style={{
                                  marginBottom: 12,
                                  paddingLeft: 12,
                                  borderLeftWidth: 2,
                                  borderLeftColor: "#6200ee",
                                }}
                              >
                                <Button
                                  compact
                                  onPress={() =>
                                    setExpandedWorkoutId(
                                      isExpanded
                                        ? null
                                        : `${variation.id}-${workout.workoutDate}`,
                                    )
                                  }
                                >
                                  <Text variant="bodySmall">
                                    {new Date(
                                      workout.workoutDate,
                                    ).toLocaleDateString()}{" "}
                                    - {workout.maxWeight}kg |{" "}
                                    {workout.totalReps} reps total
                                  </Text>
                                </Button>

                                {isExpanded && (
                                  <View style={{ marginLeft: 8, marginTop: 8 }}>
                                    {sets.map((set, index) => (
                                      <Text
                                        key={index}
                                        variant="bodySmall"
                                        style={{
                                          marginBottom: 4,
                                          paddingLeft: 8,
                                        }}
                                      >
                                        • Série {index + 1}: {set.reps} reps ×{" "}
                                        {set.weight}kg | RIR: {set.rir}
                                      </Text>
                                    ))}
                                  </View>
                                )}
                              </View>
                            );
                          }}
                        />
                      </Card.Content>
                    )}
                  </Card>
                );
              }}
            />
          )}

          <Button
            mode="contained"
            onPress={onDismiss}
            style={{ marginTop: 16 }}
          >
            Fechar
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
