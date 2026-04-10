import { StyleSheet } from "react-native";
import { spacing } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },

  title: {
    marginBottom: spacing.md,
  },

  card: {
    marginBottom: spacing.sm,
  },

  input: {
    marginTop: spacing.sm,
  },

  button: {
    marginTop: spacing.md,
  },

  fab: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
  },
});
