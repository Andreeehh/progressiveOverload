import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, Card, Chip } from "react-native-paper";
import {
  ProgressionResult,
  PROGRESSION_STATUS,
  ProgressionStatus,
} from "../../models/Progression";

interface ProgressionAnalysisModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  progressionResult: ProgressionResult | null;
}

export const ProgressionAnalysisModal: React.FC<
  ProgressionAnalysisModalProps
> = ({ visible, onDismiss, onConfirm, progressionResult }) => {
  if (!progressionResult) return null;

  const getStatusColor = (status: ProgressionStatus) => {
    switch (status) {
      case PROGRESSION_STATUS.PROGRESSION:
        return "#4CAF50"; // Verde
      case PROGRESSION_STATUS.FIRST_TIME:
        return "#2196F3"; // Azul
      case PROGRESSION_STATUS.EXCESSIVE_REP_DROP:
      case PROGRESSION_STATUS.NO_VOLUME_INCREASE:
        return "#F44336"; // Vermelho
      default:
        return "#9E9E9E"; // Cinza
    }
  };

  const getStatusIcon = (status: ProgressionStatus) => {
    switch (status) {
      case PROGRESSION_STATUS.PROGRESSION:
        return "✅";
      case PROGRESSION_STATUS.FIRST_TIME:
        return "🆕";
      case PROGRESSION_STATUS.EXCESSIVE_REP_DROP:
      case PROGRESSION_STATUS.NO_VOLUME_INCREASE:
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getStatusLabel = (status: ProgressionStatus) => {
    switch (status) {
      case PROGRESSION_STATUS.PROGRESSION:
        return "Progressão válida";
      case PROGRESSION_STATUS.FIRST_TIME:
        return "Primeira vez";
      case PROGRESSION_STATUS.EXCESSIVE_REP_DROP:
        return "Queda excessiva de repetições";
      case PROGRESSION_STATUS.NO_VOLUME_INCREASE:
        return "Sem aumento de volume";
      default:
        return status;
    }
  };

  const formatVolume = (volume: number) => {
    return volume.toFixed(1);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Title title="Análise de Progressão" titleStyle={styles.title} />
          <Card.Content>
            {/* Status */}
            <View style={styles.statusContainer}>
              <Chip
                icon={getStatusIcon(progressionResult.status)}
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(progressionResult.status) },
                ]}
                textStyle={styles.statusText}
              >
                {getStatusLabel(progressionResult.status)}
              </Chip>
            </View>

            {/* Reason */}
            <Text style={styles.reasonText}>{progressionResult.reason}</Text>

            {/* Metrics */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Volume Anterior:</Text>
                <Text style={styles.metricValue}>
                  {formatVolume(progressionResult.previousVolume)}
                </Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Volume Atual:</Text>
                <Text style={styles.metricValue}>
                  {formatVolume(progressionResult.currentVolume)}
                </Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Reps Anteriores:</Text>
                <Text style={styles.metricValue}>
                  {progressionResult.previousReps}
                </Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Reps Atuais:</Text>
                <Text style={styles.metricValue}>
                  {progressionResult.currentReps}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {progressionResult.isValid ? (
                <Button
                  mode="contained"
                  onPress={onConfirm}
                  style={styles.confirmButton}
                >
                  Salvar Treino
                </Button>
              ) : (
                <View style={styles.warningActions}>
                  <Button
                    mode="outlined"
                    onPress={onDismiss}
                    style={styles.cancelButton}
                  >
                    Revisar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={onConfirm}
                    style={styles.forceSaveButton}
                    buttonColor="#FF9800"
                  >
                    Salvar Mesmo
                  </Button>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
  },
  card: {
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusChip: {
    alignSelf: "center",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
  },
  reasonText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsContainer: {
    marginTop: 16,
  },
  confirmButton: {
    marginBottom: 8,
  },
  warningActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  forceSaveButton: {
    flex: 1,
    marginLeft: 8,
  },
});
