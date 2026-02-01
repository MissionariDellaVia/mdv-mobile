import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';

const iconMap = {
  'book-open-variant': {lib: 'MaterialCommunityIcons', name: 'book-open-variant'},
  'information-outline': {lib: 'MaterialCommunityIcons', name: 'information-outline'},
  'pen': {lib: 'MaterialCommunityIcons', name: 'lead-pencil'},
  'help-circle-outline': {lib: 'MaterialCommunityIcons', name: 'help-circle-outline'},
  'home': {lib: 'Ionicons', name: 'home'},
};

export default function ScreenHeader({icon, title, subtitle}) {
  const iconInfo = iconMap[icon] || {lib: 'MaterialCommunityIcons', name: icon};
  const IconComponent =
    iconInfo.lib === 'Ionicons' ? Ionicons : MaterialCommunityIcons;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <IconComponent
          name={iconInfo.name}
          size={28}
          color={colors.primary}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
