import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';

export default function ZoomToolbar({zoomLevel, onZoomIn, onZoomOut, onHighlight, onScrollTop}) {
  const label = `${Math.round(zoomLevel * 100)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={onZoomOut} style={styles.btn}>
          <Text style={styles.btnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onZoomIn} style={styles.btn}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={onHighlight} style={styles.btn}>
          <MaterialCommunityIcons name="lead-pencil" size={20} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onScrollTop} style={[styles.btn, styles.scrollTopBtn]}>
          <MaterialCommunityIcons name="arrow-up" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 20,
    color: colors.textDark,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDark,
    marginHorizontal: spacing.sm,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.sm,
    opacity: 0.3,
  },
  scrollTopBtn: {
    backgroundColor: colors.primary,
  },
});
