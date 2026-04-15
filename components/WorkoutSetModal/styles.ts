import { StyleSheet } from "react-native";
import { spacing } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.lg,
    gap: spacing.md,
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    minWidth: "30%",
  },
});
