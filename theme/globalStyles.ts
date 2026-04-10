import { spacing } from "./spacing";

export const globalStyles = {
  container: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  empty: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    padding: 20,
  },
  input: {
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
  fab: {
    position: "absolute" as const,
    right: spacing.md,
    bottom: spacing.md,
  },
};
