import { useState, useEffect, useRef } from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, Modal, Portal } from "react-native-paper";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const isFirstTimeRef = useRef<boolean>(false);

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

      // Calcular se é primeira vez apenas na inicialização
      isFirstTimeRef.current =
        lastWorkoutSets.length === 0 &&
        currentSets.every((set) => set.weight === 0 && set.reps === 0);
    }
  }, [visible]);

  const updateSet = (
    index: number,
    field: keyof WorkoutSet,
    value: number | string,
  ) => {
    const updated = [...localSets];
    if (field === "performedAt") {
      updated[index][field] = value as string;
    } else {
      // Converter string para number se necessário
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;
      (updated[index][
        field as keyof Omit<WorkoutSet, "performedAt">
      ] as number) = numValue;
    }

    // Se for primeira vez e está preenchendo o primeiro set, propaga para os outros
    if (isFirstTimeRef.current && index === 0 && field !== "performedAt") {
      const numValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;
      updated.forEach((set, setIndex) => {
        if (setIndex !== 0) {
          (set[field as keyof Omit<WorkoutSet, "performedAt">] as number) =
            numValue;
        }
      });
    }

    setLocalSets(updated);
  };

  const handleSave = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    // Pequeno delay para evitar cliques duplos
    await new Promise((resolve) => setTimeout(resolve, 100));

    onSave(localSets);
    onClose();
    setIsProcessing(false);
  };

  const handleNextSet = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    // Pequeno delay para evitar cliques duplos
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (currentSetIndex < defaultSets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    }
    setIsProcessing(false);
  };

  const handlePreviousSet = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    // Pequeno delay para evitar cliques duplos
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (currentSetIndex > 0) {
      setCurrentSetIndex(currentSetIndex - 1);
    }
    setIsProcessing(false);
  };

  const isLastSet = currentSetIndex === defaultSets - 1;

  const handleClose = () => {
    onClose();
  };

  const currentSet = localSets[currentSetIndex];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 8,
          maxHeight: "90%",
        }}
      >
        <ScrollView>
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
            <Button
              mode="outlined"
              onPress={handlePreviousSet}
              style={styles.button}
              disabled={currentSetIndex == 0 || isProcessing}
            >
              Anterior
            </Button>
            <Button
              mode="contained"
              onPress={isLastSet ? handleSave : handleNextSet}
              style={styles.button}
              disabled={isProcessing}
            >
              {isLastSet ? "Salvar" : "Próximo"}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
