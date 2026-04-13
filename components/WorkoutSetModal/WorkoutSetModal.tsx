import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { WorkoutSet } from "../../models/WorkoutSet";
import { spacing } from "../../theme";

interface WorkoutSetModalProps {
  visible: boolean;
  defaultSets: number;
  currentSets: WorkoutSet[];
  lastWorkoutSets: WorkoutSet[];
  onSave: (sets: WorkoutSet[]) => void;
  onClose: () => void;
}

export const WorkoutSetModal: React.FC<WorkoutSetModalProps> = ({
  visible,
  defaultSets,
  currentSets,
  lastWorkoutSets,
  onSave,
  onClose,
}) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [localSets, setLocalSets] = useState<WorkoutSet[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;

  // Inicializar localSets quando a modal abre
  React.useEffect(() => {
    if (visible) {
      const initialized = Array.from({ length: defaultSets }, (_, index) => {
        // Se tem currentSets nesse índice, usa
        if (currentSets[index]) {
          return currentSets[index];
        }
        // Senão, tenta pegar do último workout
        if (lastWorkoutSets[index]) {
          return {
            weight: lastWorkoutSets[index].weight,
            reps: lastWorkoutSets[index].reps,
            rir: lastWorkoutSets[index].rir,
            performedAt: new Date().toISOString(),
          };
        }
        // Se não tiver nada, set em branco
        return {
          weight: 0,
          reps: 0,
          rir: 0,
          performedAt: new Date().toISOString(),
        };
      });
      setLocalSets(initialized);
      setCurrentSetIndex(0);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { dx } = gestureState;

        // Swipe para direita (set anterior)
        if (dx > 50 && currentSetIndex > 0) {
          setCurrentSetIndex(currentSetIndex - 1);
        }

        // Swipe para esquerda (próximo set)
        if (dx < -50 && currentSetIndex < defaultSets - 1) {
          setCurrentSetIndex(currentSetIndex + 1);
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const updateSet = (
    index: number,
    field: keyof WorkoutSet,
    value: number | string,
  ) => {
    const updated = [...localSets];
    if (field === "performedAt") {
      updated[index][field] = value as string;
    } else {
      (updated[index][
        field as keyof Omit<WorkoutSet, "performedAt">
      ] as number) = value as number;
    }
    setLocalSets(updated);
  };

  const handleSave = () => {
    onSave(localSets);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const currentSet = localSets[currentSetIndex];

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing.md,
        }}
        {...panResponder.panHandlers}
      >
        <Text
          variant="headlineSmall"
          style={{ marginBottom: spacing.lg, textAlign: "center" }}
        >
          Set {currentSetIndex + 1} de {defaultSets}
        </Text>

        {currentSet && (
          <Card
            style={{
              width: "100%",
              paddingHorizontal: spacing.md,
            }}
          >
            <Card.Content>
              <TextInput
                label="Peso (kg)"
                keyboardType="numeric"
                value={currentSet.weight.toString()}
                onChangeText={(text) =>
                  updateSet(currentSetIndex, "weight", Number(text))
                }
                style={{ marginTop: spacing.sm }}
              />

              <TextInput
                label="Reps"
                keyboardType="numeric"
                value={currentSet.reps.toString()}
                onChangeText={(text) =>
                  updateSet(currentSetIndex, "reps", Number(text))
                }
                style={{ marginTop: spacing.sm }}
              />

              <TextInput
                label="RIR (Reps in Reserve)"
                keyboardType="numeric"
                value={currentSet.rir.toString()}
                onChangeText={(text) =>
                  updateSet(currentSetIndex, "rir", Number(text))
                }
                style={{ marginTop: spacing.sm }}
              />
            </Card.Content>
          </Card>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: spacing.lg,
            gap: spacing.md,
          }}
        >
          <Button mode="outlined" onPress={handleClose} style={{ flex: 1 }}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSave} style={{ flex: 1 }}>
            Salvar
          </Button>
        </View>

        <Text
          style={{
            marginTop: spacing.lg,
          }}
        >
          ← Deslize para navegar →
        </Text>
      </View>
    </Modal>
  );
};
