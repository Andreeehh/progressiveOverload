import { StyleSheet } from 'react-native';
import { spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    paddingTop: 50,
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
  removeButton: {
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
});
