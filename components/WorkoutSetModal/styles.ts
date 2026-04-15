import { StyleSheet } from "react-native";
import { spacing } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  button: {
    flex: 1,
  },
  swipeHint: {
    marginTop: spacing.lg,
  },
});
