import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  Share,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import {getHighlights, removeHighlight} from '../services/HighlightService';

dayjs.locale('it');

const SECTION_LABELS = {
  gospel: 'Vangelo',
  comment: 'Commento',
  reflection: 'Riflessione',
};

function formatDateHeader(date) {
  const d = dayjs(date);
  const raw = d.format('dddd D MMMM YYYY');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function groupByDate(highlights) {
  const groups = {};
  highlights.forEach(h => {
    const date = h.date || 'Senza data';
    if (!groups[date]) groups[date] = [];
    groups[date].push(h);
  });
  return Object.entries(groups).sort(([a], [b]) => (b > a ? 1 : -1));
}

function handleShare(item) {
  const dateLabel = formatDateHeader(item.date);
  const section = SECTION_LABELS[item.section] || '';
  const prefix = section ? `${section} — ${dateLabel}` : dateLabel;
  Share.share({message: `${prefix}\n\n"${item.text}"`});
}

function SwipeableCard({item, onRemove}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dy) < 20,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -100) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Animated.timing(translateX, {toValue: -400, duration: 250, useNativeDriver: true}).start(() => onRemove());
        } else {
          Animated.spring(translateX, {toValue: 0, useNativeDriver: true}).start();
        }
      },
    }),
  ).current;

  const sectionLabel = SECTION_LABELS[item.section] || '';

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBackground}>
        <MaterialCommunityIcons name="delete-outline" size={22} color={colors.white} />
        <Text style={styles.deleteText}>Elimina</Text>
      </View>
      <Animated.View
        style={[styles.cardOuter, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}
      >
        <View style={styles.card}>
          <View style={styles.goldBar} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              {sectionLabel ? (
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{sectionLabel}</Text>
                </View>
              ) : <View />}
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleShare(item)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Ionicons name="share-outline" size={18} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onRemove} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{marginLeft: spacing.md}}>
                  <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.highlightText}>{item.text}</Text>
            {item.createdAt && (
              <Text style={styles.createdAtText}>
                Salvato il {dayjs(item.createdAt).format('D MMM YYYY [alle] HH:mm')}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function HighlightsScreen() {
  const scrollRef = useRef(null);
  const [highlights, setHighlights] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({y: 0, animated: false});
      (async () => {
        const data = await getHighlights();
        setHighlights(data);
      })();
    }, []),
  );

  const handleRemove = async id => {
    const updated = await removeHighlight(id);
    setHighlights(updated);
  };

  const filtered = search
    ? highlights.filter(h => h.text.toLowerCase().includes(search.toLowerCase()))
    : highlights;
  const groups = groupByDate(filtered);

  return (
    <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader title="Le tue Evidenziature" />

      {highlights.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca nelle evidenziature..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="text-box-search-outline" size={64} color={colors.primary} style={{opacity: 0.5}} />
          <Text style={styles.emptyTitle}>Nessuna evidenziatura</Text>
          <Text style={styles.emptySubtitle}>
            Attiva la modalita evidenziatura nella sezione Vangelo, seleziona del testo e premi "Evidenzia" per salvarlo qui.
          </Text>
        </View>
      ) : (
        groups.map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
            {items.map(item => (
              <SwipeableCard key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
            ))}
          </View>
        ))
      )}
    </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    padding: 0,
    paddingVertical: 0,
    height: 24,
    lineHeight: 20,
    textAlignVertical: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.cardBackground,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.cardBackground,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  dateHeader: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.cardBackground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  swipeContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#c0392b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: spacing.lg,
  },
  deleteText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  cardOuter: {
    borderRadius: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  goldBar: {
    width: 4,
    backgroundColor: colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionBadge: {
    backgroundColor: 'rgba(166,125,81,0.15)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  highlightText: {
    fontFamily: fonts.body,
    fontSize: 20,
    color: colors.textDark,
    lineHeight: 32,
  },
  createdAtText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
