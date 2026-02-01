import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, Image, RefreshControl, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';
import Card from '../components/Card';
import OfflineBanner from '../components/OfflineBanner';
import {HomeSkeleton} from '../components/SkeletonLoader';
import {getHomeInfo} from '../services/ApiService';
import {getCachedHomeInfo, invalidateKey} from '../services/CacheService';

dayjs.locale('it');

export default function HomeScreen() {
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerMsg, setBannerMsg] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, []));

  const today = dayjs().format('YYYY-MM-DD');
  const todayLabel =
    dayjs().format('dddd D MMMM YYYY').charAt(0).toUpperCase() +
    dayjs().format('dddd D MMMM YYYY').slice(1);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      if (skipCache) await invalidateKey(`home_info_${today}`);
      const data = await getCachedHomeInfo(today, () => getHomeInfo(today));
      setInfo(data);
      setBannerMsg(null);
      Animated.timing(fadeAnim, {toValue: 1, duration: 350, useNativeDriver: true}).start();
    } catch (e) {
      console.warn('Failed to load home info:', e);
      if (info) {
        setBannerMsg('Contenuto dalla cache');
      } else {
        setBannerMsg('Nessuna connessione');
      }
    }
  }, [today, fadeAnim, info]);

  useEffect(() => {
    (async () => {
      await fetchData();
      setLoading(false);
    })();
  }, [today]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, [fetchData]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
      }
    >
      <View style={[styles.logoContainer, {paddingTop: insets.top + spacing.md}]}>
        <Image
          source={require('../assets/logo-mdv-aggiornato.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <OfflineBanner message={bannerMsg} />

      {loading ? (
        <HomeSkeleton />
      ) : (
      <Animated.View style={{opacity: fadeAnim}}>
      <Card>
        <Text style={styles.dateText}>{todayLabel}</Text>

        {(info?.saints || info?.saint) && (
          <Text style={styles.saintText}>{info.saints || info.saint}</Text>
        )}
        {info?.season && (
          <Text style={styles.seasonText}>{info.season}</Text>
        )}
        <View style={styles.divider} />
        <Text style={styles.welcomeTitle}>
          Caro fratello o sorella <Text style={{fontFamily: fonts.heading}}>benvenuto/a!</Text>
        </Text>
        <Text style={styles.bodyText}>
          Questo sito contiene il diario spirituale della Comunità sul Vangelo del giorno.
          L'abbiamo realizzata perché potesse servire anche a te!
        </Text>
        <Text style={styles.bodyText}>
          Questo commento è un aiuto per meditare e custodire almeno una parola del Vangelo,
          perché possa portare frutto nel cammino quotidiano alla sequela di Gesù
          e per vivere il carisma della comunità più intensamente!
        </Text>
        <Text style={styles.italicNote}>
          {info?.bookletNote || 'Se volessi il libretto cartaceo trimestrale (da poter sottolineare e dove poter prendere appunti) puoi richiederlo scrivendoci.'}
        </Text>
      </Card>
      </Animated.View>
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
    paddingBottom: spacing.xxl + spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  dateText: {
    fontFamily: fonts.display,
    fontSize: 23,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  saintText: {
    fontFamily: fonts.headingItalic,
    fontSize: 19,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  seasonText: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: spacing.md,
  },
  welcomeTitle: {
    fontFamily: fonts.body,
    fontSize: 19,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 19,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  italicNote: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
    marginTop: spacing.sm,
  },
});
