import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import DateSlider from '../components/DateSlider';
import ZoomToolbar from '../components/ZoomToolbar';
import VideoCarousel from '../components/VideoCarousel';
import OfflineBanner from '../components/OfflineBanner';
import {GospelSkeleton} from '../components/SkeletonLoader';
import {getGospelWay, getAllowedDates} from '../services/ApiService';
import {getCachedGospelWay, getCachedDates, invalidateKey} from '../services/CacheService';
import {addHighlight, getHighlightsByDate} from '../services/HighlightService';
import HtmlText from '../components/HtmlText';

dayjs.locale('it');

const stripHtml = (html) => html?.replace(/<[^>]+>/g, '').trim() || '';
const hasContent = (html) => !!html && stripHtml(html).length > 0;

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

const ZOOM_STORAGE_KEY = 'gospel_zoom_level';

export default function GospelWayScreen({route}) {
  const scrollRef = useRef(null);
  const [dates, setDates] = useState([]);
  const initialDate = route?.params?.date || dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [gospel, setGospel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerMsg, setBannerMsg] = useState(null);
  const [selectedRelated, setSelectedRelated] = useState(null);
  const [showPrayer, setShowPrayer] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [savedHighlights, setSavedHighlights] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const savedZoom = await AsyncStorage.getItem(ZOOM_STORAGE_KEY);
        if (savedZoom) setZoom(parseFloat(savedZoom));
      } catch {}
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
    if (route?.params?.date && route.params.date !== selectedDate) {
      setSelectedDate(route.params.date);
    }
  }, [route?.params?.date]);

  const fetchGospel = useCallback(async (skipCache = false) => {
    setLoading(true);
    try {
      if (skipCache) await invalidateKey(`gospel_way_${selectedDate}`);
      const data = await getCachedGospelWay(selectedDate, () =>
        getGospelWay(selectedDate),
      );
      setGospel(data);
      setBannerMsg(null);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {toValue: 1, duration: 350, useNativeDriver: true}).start();
    } catch (e) {
      console.warn('Failed to load gospel:', e);
      if (gospel) {
        setBannerMsg('Contenuto dalla cache');
      } else {
        setBannerMsg('Nessuna connessione');
        setGospel(null);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDate, fadeAnim, gospel]);

  useEffect(() => { fetchGospel(); }, [selectedDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGospel(true);
    setRefreshing(false);
  }, [fetchGospel]);

  const loadHighlights = useCallback(() => {
    (async () => {
      const hl = await getHighlightsByDate(selectedDate);
      setSavedHighlights(hl);
    })();
  }, [selectedDate]);

  useEffect(() => { loadHighlights(); }, [loadHighlights]);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
    loadHighlights();
  }, [loadHighlights]));

  const onZoomIn = useCallback(() => setZoom(z => {
    const next = Math.min(z + ZOOM_STEP, MAX_ZOOM);
    AsyncStorage.setItem(ZOOM_STORAGE_KEY, String(next));
    return next;
  }), []);
  const onZoomOut = useCallback(() => setZoom(z => {
    const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
    AsyncStorage.setItem(ZOOM_STORAGE_KEY, String(next));
    return next;
  }), []);
  const onScrollTop = useCallback(() => scrollRef.current?.scrollTo({y: 0, animated: true}), []);

  const toggleHighlightMode = useCallback(() => {
    setHighlightMode(h => !h);
    setSelectedText('');
    setSelectedSection('');
  }, []);

  const handleSelection = useCallback((section, text) => {
    setSelectedText(text);
    setSelectedSection(section);
  }, []);

  const handleHighlight = useCallback(async () => {
    if (!selectedText) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addHighlight({
      text: selectedText,
      date: selectedDate,
      section: selectedSection,
    });
    const updated = await getHighlightsByDate(selectedDate);
    setSavedHighlights(updated);
    setSelectedText('');
    setSelectedSection('');
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, {toValue: 1, duration: 200, useNativeDriver: true}),
      Animated.delay(1200),
      Animated.timing(toastOpacity, {toValue: 0, duration: 300, useNativeDriver: true}),
    ]).start(() => setToastVisible(false));
  }, [selectedText, selectedDate, selectedSection, toastOpacity]);

  const openRelated = async (item) => {
    setSelectedRelated({date: item.date, saints: item.saints, loading: true});
    try {
      const data = await getGospelWay(item.date);
      setSelectedRelated({
        date: item.date,
        saints: data?.saints || item.saints,
        comment: data?.comments?.main,
        reflection: data?.comments?.reflection,
        loading: false,
      });
    } catch (e) {
      console.warn('Failed to load related:', e);
      setSelectedRelated(null);
    }
  };

  const dateLabel = (() => {
    const d = dayjs(selectedDate);
    const raw = d.format('dddd D MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  })();

  const formatRelatedDate = (date) => {
    const d = dayjs(date);
    const raw = d.format('dddd D MMMM YYYY');
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  const bodyFontSize = 20 * zoom;
  const titleFontSize = 20 * zoom;

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        <ScreenHeader
          title="Vangelo del Giorno"
          subtitle="Meditazione quotidiana sulla Parola"
        />

        <OfflineBanner message={bannerMsg} />

        <Card>
          <DateSlider
            dates={dates.length ? dates : [selectedDate]}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <View style={styles.divider} />

          <Text style={styles.dateLabel}>{dateLabel}</Text>

          {loading ? null : gospel ? (
            <>
              {gospel.saints && (
                <Text style={styles.saintText}>{gospel.saints}</Text>
              )}
              {gospel.liturgical_season && (
                <Text style={styles.seasonText}>{gospel.liturgical_season}</Text>
              )}
              {gospel.sacred_texts && (
                <Text style={styles.referencesText}>{gospel.sacred_texts}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.seasonText, {marginTop: spacing.md}]}>
              Contenuto non disponibile per questa data
            </Text>
          )}
        </Card>

        {loading && <GospelSkeleton />}

        <Animated.View style={{opacity: fadeAnim}}>
        {gospel && (
          <TouchableOpacity
            style={styles.prayerBanner}
            onPress={() => setShowPrayer(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.prayerIcon}>✙</Text>
            <Text style={styles.prayerText}>Preghiera allo Spirito Santo</Text>
          </TouchableOpacity>
        )}

        {highlightMode && (
          <View style={styles.highlightBanner}>
            <MaterialCommunityIcons name="gesture-tap" size={20} color={colors.white} />
            <Text style={styles.highlightBannerText}>
              Seleziona il testo da evidenziare, poi premi "Evidenzia"
            </Text>
          </View>
        )}

        {gospel?.gospel && (
          <Card>
            <Text style={[styles.gospelTitle, {fontSize: titleFontSize}]}>
              DAL VANGELO SECONDO {gospel.gospel.evangelist?.toUpperCase() || ''}
            </Text>
            {gospel.gospel.reference && (
              <Text style={styles.gospelReference}>{gospel.gospel.reference}</Text>
            )}
            <SelectableText
              text={gospel.gospel.text || ''}
              section="gospel"
              active={highlightMode}
              onSelection={handleSelection}
              highlights={savedHighlights}
              style={[styles.gospelText, {fontSize: bodyFontSize}]}
            />
          </Card>
        )}

        {hasContent(gospel?.comments?.main) && (
          <Card>
            <Text style={[styles.sectionTitle, {fontSize: titleFontSize}]}>
              COMMENTO AL VANGELO
            </Text>
            {highlightMode ? (
              <SelectableText
                text={stripHtml(gospel.comments.main)}
                section="comment"
                active={highlightMode}
                onSelection={handleSelection}
                highlights={savedHighlights}
                style={[styles.bodyText, {fontSize: bodyFontSize}]}
              />
            ) : (
              <HtmlText
                html={gospel.comments.main}
                style={[styles.bodyText, {fontSize: bodyFontSize}]}
              />
            )}
          </Card>
        )}

        {hasContent(gospel?.comments?.reflection) && (
          <Card>
            <Text style={[styles.sectionTitle, {fontSize: titleFontSize}]}>
              RIFLESSIONI
            </Text>
            {highlightMode ? (
              <SelectableText
                text={stripHtml(gospel.comments.reflection)}
                section="reflection"
                active={highlightMode}
                onSelection={handleSelection}
                highlights={savedHighlights}
                style={[styles.bodyText, {fontSize: bodyFontSize}]}
              />
            ) : (
              <HtmlText
                html={gospel.comments.reflection}
                style={[styles.bodyText, {fontSize: bodyFontSize}]}
              />
            )}
          </Card>
        )}

        {gospel?.media?.videos?.length > 0 && (
          <Card>
            <VideoCarousel videos={gospel.media.videos} />
          </Card>
        )}

        {gospel?.related?.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>COMMENTI PRECEDENTI</Text>
            <ScrollView style={styles.relatedList} nestedScrollEnabled>
            {gospel.related.map((item, index) => {
              const relDateLabel = formatRelatedDate(item.date);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.relatedItem}
                  onPress={() => openRelated(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.relatedHeader}>
                    <View style={styles.relatedAvatar}>
                      <Text style={styles.relatedAvatarText}>
                        {(item.saints || 'V').charAt(0)}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.relatedAuthor}>
                        Commento del {relDateLabel}
                      </Text>
                      {item.saints && (
                        <Text style={styles.relatedDate}>{item.saints}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.relatedPreview} numberOfLines={2}>
                    {item.excerpt || ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
            </ScrollView>
          </Card>
        )}

        </Animated.View>
        <View style={{height: 80}} />
      </ScrollView>

      <ZoomToolbar
        zoomLevel={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onHighlight={toggleHighlightMode}
        onScrollTop={onScrollTop}
        highlightActive={highlightMode}
      />

      {highlightMode && selectedText !== '' && (
        <TouchableOpacity style={styles.floatingHighlightBtn} onPress={handleHighlight} activeOpacity={0.8}>
          <MaterialCommunityIcons name="marker" size={18} color={colors.white} />
          <Text style={styles.floatingHighlightText}>Evidenzia</Text>
        </TouchableOpacity>
      )}

      {toastVisible && (
        <Animated.View style={[styles.toast, {opacity: toastOpacity}]}>
          <Text style={styles.toastText}>Evidenziato!</Text>
        </Animated.View>
      )}

      <RelatedModal
        data={selectedRelated}
        onClose={() => setSelectedRelated(null)}
      />

      <PrayerModal
        visible={showPrayer}
        onClose={() => setShowPrayer(false)}
      />
    </View>
  );
}

function buildHighlightedText(text, section, highlights) {
  const sectionHighlights = highlights
    .filter(h => h.section === section)
    .map(h => h.text)
    .sort((a, b) => b.length - a.length);

  if (sectionHighlights.length === 0) return [{text, highlighted: false}];

  const segments = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = -1;
    let matchedHL = null;

    for (const hl of sectionHighlights) {
      const idx = remaining.indexOf(hl);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchedHL = hl;
      }
    }

    if (earliest === -1) {
      segments.push({text: remaining, highlighted: false});
      break;
    }

    if (earliest > 0) {
      segments.push({text: remaining.substring(0, earliest), highlighted: false});
    }
    segments.push({text: matchedHL, highlighted: true});
    remaining = remaining.substring(earliest + matchedHL.length);
  }

  return segments;
}

function SelectableText({text, section, active, onSelection, highlights = [], style}) {
  const selectionRef = useRef({start: 0, end: 0});

  if (!active) {
    const segments = buildHighlightedText(text, section, highlights);
    const hasHighlights = segments.some(s => s.highlighted);

    if (!hasHighlights) return <Text style={style}>{text}</Text>;

    return (
      <Text style={style}>
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <Text key={i} style={styles.highlightedSpan}>{seg.text}</Text>
          ) : (
            <Text key={i}>{seg.text}</Text>
          ),
        )}
      </Text>
    );
  }

  return (
    <TextInput
      value={text}
      editable={false}
      multiline
      scrollEnabled={false}
      style={[style, styles.selectableInput]}
      selectionColor="rgba(166,125,81,0.35)"
      onSelectionChange={({nativeEvent: {selection}}) => {
        selectionRef.current = selection;
        if (selection.start !== selection.end) {
          const selected = text.substring(selection.start, selection.end).trim();
          if (selected) onSelection(section, selected);
        }
      }}
    />
  );
}

function RelatedModal({data, onClose}) {
  const insets = useSafeAreaInsets();
  if (!data) return null;

  return (
    <Modal
      visible={!!data}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[modalStyles.container, {paddingTop: insets.top}]}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.headerTitle}>
            {data.saints || formatModalDate(data.date)}
          </Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Text style={modalStyles.closeBtnText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
        <Text style={modalStyles.dateLabel}>{formatModalDate(data.date)}</Text>
        <ScrollView style={modalStyles.body} contentContainerStyle={{paddingBottom: 40}}>
          {data.loading ? (
            <ActivityIndicator color={colors.primary} style={{marginTop: spacing.xxl}} />
          ) : (
            <>
              {data.comment ? (
                <>
                  <Text style={modalStyles.sectionTitle}>COMMENTO AL VANGELO</Text>
                  <HtmlText html={data.comment} style={modalStyles.text} />
                </>
              ) : null}
              {data.reflection ? (
                <>
                  <Text style={modalStyles.sectionTitle}>RIFLESSIONI</Text>
                  <HtmlText html={data.reflection} style={modalStyles.text} />
                </>
              ) : null}
              {!data.comment && !data.reflection && (
                <Text style={modalStyles.text}>Contenuto non disponibile.</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function PrayerModal({visible, onClose}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={prayerStyles.overlay}>
        <View style={prayerStyles.card}>
          <Text style={prayerStyles.title}>PREGHIERA ALLO SPIRITO SANTO</Text>
          <Text style={prayerStyles.subtitle}>(da recitare prima di iniziare la lettura)</Text>
          <Text style={prayerStyles.text}>
            {'Vieni Spirito Santo,\nguidaci nella comprensione della Parola,\nillumina le profondità della nostra anima\ne converti i nostri cuori,\nperché liberi dalle seduzioni del male,\npossiamo amare Dio e i nostri fratelli e sorelle\nfino a dare la vita per loro.\nAmen'}
          </Text>
          <TouchableOpacity onPress={onClose} style={prayerStyles.closeBtn}>
            <Text style={prayerStyles.closeBtnText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const prayerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  closeBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  closeBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.white,
  },
});

function formatModalDate(date) {
  const d = dayjs(date);
  const raw = d.format('dddd D MMMM YYYY');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.textDark,
    flex: 1,
  },
  closeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  closeBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.primary,
  },
  dateLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 26,
    textAlign: 'justify',
  },
});

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
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  saintText: {
    fontFamily: fonts.headingItalic,
    fontSize: 22,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  seasonText: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: 'center',
  },
  referencesText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
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
    fontSize: 17,
    color: colors.white,
  },
  gospelTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  gospelReference: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  gospelText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 26,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 26,
    textAlign: 'justify',
  },
  relatedList: {
    maxHeight: 300,
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
    backgroundColor: 'rgba(166,125,81,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  relatedAvatarText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.primary,
  },
  relatedAuthor: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: colors.textDark,
  },
  relatedDate: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  relatedPreview: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textMuted,
    lineHeight: 26,
  },
  floatingHighlightBtn: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  floatingHighlightText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  toast: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 20,
  },
  toastText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.white,
  },
  highlightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 10,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  highlightBannerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.white,
    marginLeft: spacing.sm,
    flex: 1,
  },
  highlightedSpan: {
    backgroundColor: 'rgba(166,125,81,0.2)',
    borderRadius: 2,
  },
  selectableInput: {
    padding: 0,
    margin: 0,
    textAlignVertical: 'top',
  },
});
