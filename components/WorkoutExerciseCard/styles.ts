import { StyleSheet } from 'react-native';
import { spacing, globalStyles } from '../../theme';

export const styles = StyleSheet.create({
  card: globalStyles.card,
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    padding: spacing.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  iconButton: {
    margin: 0,
  },
});