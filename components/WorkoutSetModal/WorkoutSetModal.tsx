import { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { WorkoutSet } from "../../models/WorkoutSet";
import { styles } from "./styles";
import { WorkoutSetCard } from "../WorkoutSetCard";

interface WorkoutSetModalProps {
  visible: boolean;
  defaultSets: number;
  currentSets: WorkoutSet[];
  lastWorkoutSets: WorkoutSet[];
  onSave: (sets: WorkoutSet[]) => void;
  onClose: () => void;
}

export const WorkoutSetModal = ({
  visible,
  defaultSets,
  currentSets,
  lastWorkoutSets,
  onSave,
  onClose,
}: WorkoutSetModalProps) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [localSets, setLocalSets] = useState<WorkoutSet[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const currentSetIndexRef = useRef(currentSetIndex);

  // Atualizar a ref sempre que currentSetIndex mudar
  useEffect(() => {
    currentSetIndexRef.current = currentSetIndex;
  }, [currentSetIndex]);

  // Inicializar localSets quando a modal abre
  useEffect(() => {
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
        const currentIndex = currentSetIndexRef.current;

        // Swipe para direita (set anterior)
        if (dx > 50 && currentIndex > 0) {
          setCurrentSetIndex(currentIndex - 1);
        }

        // Swipe para esquerda (próximo set)
        if (dx < -50 && currentIndex < defaultSets - 1) {
          setCurrentSetIndex(currentIndex + 1);
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
      <View style={styles.container} {...panResponder.panHandlers}>
        <Text variant="headlineSmall" style={styles.title}>
          Set {currentSetIndex + 1} de {defaultSets}
        </Text>

        {currentSet && (
          <WorkoutSetCard
            workoutSet={currentSet}
            onUpdate={(field, value) =>
              updateSet(currentSetIndex, field, value)
            }
          />
        )}

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleClose} style={styles.button}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Salvar
          </Button>
        </View>

        <Text style={styles.swipeHint}>← Deslize para navegar →</Text>
      </View>
    </Modal>
  );
};
