import { StyleSheet } from "react-native";
import { spacing } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  fieldContainer: {
    marginTop: spacing.sm,
  },
  label: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  valueInput: {
    width: 60,
    textAlign: "center",
    fontSize: 18,
  },
});
