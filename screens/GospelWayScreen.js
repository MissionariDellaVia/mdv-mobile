import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import DateSlider from '../components/DateSlider';
import ZoomToolbar from '../components/ZoomToolbar';
import VideoCarousel from '../components/VideoCarousel';
import {getGospelWay, getAllowedDates} from '../services/ApiService';
import {getCachedGospelWay, getCachedDates} from '../services/CacheService';

dayjs.locale('it');

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

export default function GospelWayScreen() {
  const scrollRef = useRef(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [gospel, setGospel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    (async () => {
      try {
        const d = await getCachedDates(() => getAllowedDates());
        setDates(Array.isArray(d) ? d : d?.dates || []);
      } catch (e) {
        console.warn('Failed to load dates:', e);
        setDates([selectedDate]);
      }
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await getCachedGospelWay(selectedDate, () =>
          getGospelWay(selectedDate),
        );
        setGospel(data);
      } catch (e) {
        console.warn('Failed to load gospel:', e);
        setGospel(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDate]);

  const onZoomIn = useCallback(() => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM)), []);
  const onZoomOut = useCallback(() => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM)), []);
  const onScrollTop = useCallback(() => scrollRef.current?.scrollTo({y: 0, animated: true}), []);

  const dateLabel = (() => {
    const d = dayjs(selectedDate);
    const raw = d.format('dddd D MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  })();

  const bodyFontSize = 15 * zoom;
  const titleFontSize = 18 * zoom;

  return (
    <View style={styles.screen}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <ScreenHeader
          icon="book-open-variant"
          title="Vangelo del Giorno"
          subtitle="Meditazione quotidiana sulla Parola"
        />

        <Card>
          <DateSlider
            dates={dates.length ? dates : [selectedDate]}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <View style={styles.divider} />

          <Text style={styles.dateLabel}>{dateLabel}</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{marginVertical: spacing.lg}} />
          ) : gospel ? (
            <>
              {gospel.saint && (
                <Text style={styles.saintText}>{gospel.saint}</Text>
              )}
              {gospel.season && (
                <Text style={styles.seasonText}>{gospel.season}</Text>
              )}
              {gospel.references && (
                <Text style={styles.referencesText}>{gospel.references}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.seasonText, {marginTop: spacing.md}]}>
              Contenuto non disponibile per questa data
            </Text>
          )}
        </Card>

        {gospel?.prayer && (
          <View style={styles.prayerBanner}>
            <Text style={styles.prayerIcon}>✙</Text>
            <Text style={styles.prayerText}>Preghiera allo Spirito Santo</Text>
          </View>
        )}

        {gospel?.gospel && (
          <Card>
            <Text style={[styles.gospelTitle, {fontSize: titleFontSize}]}>
              DAL VANGELO SECONDO {gospel.evangelista?.toUpperCase() || ''}
            </Text>
            <Text style={[styles.gospelText, {fontSize: bodyFontSize}]}>
              {gospel.gospel}
            </Text>
          </Card>
        )}

        {gospel?.comments?.main && (
          <Card>
            <Text style={[styles.sectionTitle, {fontSize: titleFontSize}]}>
              COMMENTO AL VANGELO
            </Text>
            <Text style={[styles.bodyText, {fontSize: bodyFontSize}]}>
              {gospel.comments.main}
            </Text>
          </Card>
        )}

        {gospel?.comments?.reflection && (
          <Card>
            <Text style={[styles.sectionTitle, {fontSize: titleFontSize}]}>
              RIFLESSIONI
            </Text>
            <Text style={[styles.bodyText, {fontSize: bodyFontSize}]}>
              {gospel.comments.reflection}
            </Text>
          </Card>
        )}

        {gospel?.media?.videos && (
          <Card>
            <VideoCarousel videos={gospel.media.videos} />
          </Card>
        )}

        {gospel?.related?.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>COMMENTI PRECEDENTI</Text>
            {gospel.related.map((item, index) => (
              <View key={index} style={styles.relatedItem}>
                <View style={styles.relatedHeader}>
                  <View style={styles.relatedAvatar}>
                    <Text style={styles.relatedAvatarText}>
                      {(item.author || 'A').charAt(0)}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.relatedAuthor}>{item.author}</Text>
                  </View>
                  <Text style={styles.relatedDate}>{item.date}</Text>
                </View>
                <Text style={styles.relatedPreview} numberOfLines={2}>
                  {item.preview}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <View style={{height: 80}} />
      </ScrollView>

      <ZoomToolbar
        zoomLevel={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onHighlight={() => {}}
        onScrollTop={onScrollTop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: spacing.md,
  },
  dateLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  saintText: {
    fontFamily: fonts.headingItalic,
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  seasonText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  referencesText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  prayerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  prayerIcon: {
    fontSize: 20,
    color: colors.white,
    marginRight: spacing.sm,
  },
  prayerText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.white,
  },
  gospelTitle: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  gospelText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 26,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 26,
  },
  relatedItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  relatedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(193,123,60,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  relatedAvatarText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
  },
  relatedAuthor: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  relatedDate: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  relatedPreview: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
