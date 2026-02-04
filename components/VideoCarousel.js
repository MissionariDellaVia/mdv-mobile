import React, {useRef, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image, Animated, StyleSheet, Linking} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function VideoCard({video, index}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = index * 100;
    Animated.parallel([
      Animated.timing(opacity, {toValue: 1, duration: 300, delay, useNativeDriver: true}),
      Animated.timing(translateX, {toValue: 0, duration: 300, delay, useNativeDriver: true}),
    ]).start();
  }, []);

  const url = typeof video === 'string' ? video : video?.url;
  const videoId = extractYouTubeId(url);
  const thumbnailUri = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;
  const title = typeof video === 'string'
    ? (index === 0 ? 'Commento al Vangelo' : `Riflessione ${index}`)
    : video?.title;

  return (
    <Animated.View style={{opacity, transform: [{translateX}]}}>
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => url && Linking.openURL(url)}
        activeOpacity={0.8}
      >
        <View style={styles.thumbnailContainer}>
          {thumbnailUri ? (
            <View>
              <Image source={{uri: thumbnailUri}} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <MaterialCommunityIcons name="play-circle" size={36} color={colors.white} />
              </View>
            </View>
          ) : (
            <View style={[styles.thumbnail, styles.placeholderThumb]}>
              <MaterialCommunityIcons name="play-circle" size={32} color={colors.white} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function VideoCarousel({videos = []}) {
  if (!videos.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>VIDEO</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  videoCard: {
    width: 200,
  },
  thumbnailContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  thumbnail: {
    width: 200,
    height: 112,
    borderRadius: 12,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeholderThumb: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDark,
  },
});
