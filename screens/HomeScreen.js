import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Image, ActivityIndicator} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';
import Card from '../components/Card';
import {getHomeInfo} from '../services/ApiService';
import {getCachedHomeInfo} from '../services/CacheService';

dayjs.locale('it');

export default function HomeScreen() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = dayjs().format('YYYY-MM-DD');
  const todayLabel =
    dayjs().format('dddd D MMMM YYYY').charAt(0).toUpperCase() +
    dayjs().format('dddd D MMMM YYYY').slice(1);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCachedHomeInfo(today, () => getHomeInfo(today));
        setInfo(data);
      } catch (e) {
        console.warn('Failed to load home info:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [today]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/pergamena-background.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Card>
        <Text style={styles.dateText}>{todayLabel}</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{marginVertical: spacing.lg}} />
        ) : info ? (
          <>
            {info.saint && (
              <Text style={styles.saintText}>{info.saint}</Text>
            )}
            {info.season && (
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
              perché possa portare frutto nel cammino quotidiano alla sequela di Gesù.
            </Text>
            {info.bookletNote && (
              <Text style={styles.italicNote}>{info.bookletNote}</Text>
            )}
          </>
        ) : (
          <>
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
              perché possa portare frutto nel cammino quotidiano alla sequela di Gesù.
            </Text>
            <Text style={styles.italicNote}>
              Se desideri il libretto cartaceo trimestrale, dove poter sottolineare e prendere appunti,
              puoi richiederlo scrivendoci.
            </Text>
          </>
        )}
      </Card>
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
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dateText: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  saintText: {
    fontFamily: fonts.headingItalic,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  seasonText: {
    fontFamily: fonts.body,
    fontSize: 14,
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
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  italicNote: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
