import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Linking} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';

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
          <TouchableOpacity
            key={index}
            style={styles.videoCard}
            onPress={() => video.url && Linking.openURL(video.url)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbnailContainer}>
              {video.thumbnail ? (
                <Image source={{uri: video.thumbnail}} style={styles.thumbnail} />
              ) : (
                <View style={[styles.thumbnail, styles.placeholderThumb]}>
                  <MaterialCommunityIcons name="play-circle" size={32} color={colors.white} />
                </View>
              )}
            </View>
            {video.title && (
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
            )}
          </TouchableOpacity>
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
    width: 160,
  },
  thumbnailContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  thumbnail: {
    width: 160,
    height: 100,
    borderRadius: 12,
  },
  placeholderThumb: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textDark,
  },
});
