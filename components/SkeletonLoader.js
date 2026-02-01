import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {colors, spacing} from '../theme';

const SHIMMER_DURATION = 1500;

function ShimmerLine({width = '100%', height = 14, style}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: SHIMMER_DURATION,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.line, {width, height, borderRadius: height / 2}, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {transform: [{translateX}]},
        ]}
      />
    </View>
  );
}

const RANDOM_WIDTHS = ['95%', '88%', '92%', '85%', '90%', '78%', '96%'];

function TextBlock({lines = 6}) {
  return (
    <View style={styles.textBlock}>
      {Array.from({length: lines}).map((_, i) => (
        <ShimmerLine
          key={i}
          width={RANDOM_WIDTHS[i % RANDOM_WIDTHS.length]}
          height={12}
          style={styles.textLine}
        />
      ))}
    </View>
  );
}

export function GospelSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header card */}
      <View style={styles.card}>
        <ShimmerLine width="50%" height={18} style={styles.centered} />
        <ShimmerLine width="70%" height={14} style={[styles.centered, {marginTop: spacing.sm}]} />
        <ShimmerLine width="40%" height={12} style={[styles.centered, {marginTop: spacing.sm}]} />
        <View style={styles.divider} />
        <ShimmerLine width="60%" height={20} style={styles.centered} />
        <ShimmerLine width="45%" height={12} style={[styles.centered, {marginTop: spacing.xs}]} />
        <ShimmerLine width="50%" height={12} style={[styles.centered, {marginTop: spacing.xs}]} />
      </View>

      {/* Prayer banner */}
      <ShimmerLine width="100%" height={48} style={styles.bannerSkeleton} />

      {/* Gospel card */}
      <View style={styles.card}>
        <ShimmerLine width="55%" height={16} style={styles.centered} />
        <ShimmerLine width="25%" height={12} style={[styles.centered, {marginTop: spacing.sm}]} />
        <TextBlock lines={6} />
      </View>

      {/* Comment card */}
      <View style={styles.card}>
        <ShimmerLine width="45%" height={16} style={styles.centered} />
        <TextBlock lines={8} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ShimmerLine width="65%" height={20} style={styles.centered} />
        <ShimmerLine width="50%" height={16} style={[styles.centered, {marginTop: spacing.sm}]} />
        <ShimmerLine width="40%" height={12} style={[styles.centered, {marginTop: spacing.sm}]} />
        <View style={styles.divider} />
        <ShimmerLine width="70%" height={16} style={styles.centered} />
        <TextBlock lines={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  line: {
    backgroundColor: '#d4c4a8',
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 120,
  },
  centered: {
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: spacing.md,
  },
  textBlock: {
    marginTop: spacing.md,
  },
  textLine: {
    marginBottom: spacing.sm,
  },
  bannerSkeleton: {
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: '#c9a882',
    overflow: 'hidden',
  },
});
