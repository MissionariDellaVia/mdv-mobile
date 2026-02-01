import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, spacing} from '../theme';

export default function Card({children, style}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
});
