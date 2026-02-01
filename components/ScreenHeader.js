import React, {useRef, useEffect} from 'react';
import {View, Text, Image, Animated, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';

const iconMap = {
  'book-open-variant': {lib: 'MaterialCommunityIcons', name: 'book-open-variant'},
  'information-outline': {lib: 'MaterialCommunityIcons', name: 'information-outline'},
  'pen': {lib: 'MaterialCommunityIcons', name: 'lead-pencil'},
  'help-circle-outline': {lib: 'MaterialCommunityIcons', name: 'help-circle-outline'},
  'home': {lib: 'Ionicons', name: 'home'},
};

export default function ScreenHeader({icon, imageIcon, title, subtitle}) {
  const insets = useSafeAreaInsets();
  const iconInfo = iconMap[icon] || {lib: 'MaterialCommunityIcons', name: icon};
  const IconComponent =
    iconInfo.lib === 'Ionicons' ? Ionicons : MaterialCommunityIcons;

  const iconAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(iconAnim, {toValue: 1, duration: 350, useNativeDriver: true}),
      Animated.timing(titleAnim, {toValue: 1, duration: 300, useNativeDriver: true}),
      Animated.timing(subtitleAnim, {toValue: 1, duration: 300, useNativeDriver: true}),
    ]).start();
  }, []);

  const iconScale = iconAnim.interpolate({inputRange: [0, 1], outputRange: [0.7, 1]});

  return (
    <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
      {(icon || imageIcon) && (
        <Animated.View style={[styles.iconCircle, {opacity: iconAnim, transform: [{scale: iconScale}]}]}>
          {imageIcon ? (
            <Image source={imageIcon} style={styles.imageIcon} resizeMode="contain" />
          ) : (
            <IconComponent
              name={iconInfo.name}
              size={28}
              color={colors.primary}
            />
          )}
        </Animated.View>
      )}
      <Animated.Text style={[styles.title, {opacity: titleAnim}]}>{title}</Animated.Text>
      {subtitle && <Animated.Text style={[styles.subtitle, {opacity: subtitleAnim}]}>{subtitle}</Animated.Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
  imageIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
