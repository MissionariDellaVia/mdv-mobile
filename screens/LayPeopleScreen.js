import React from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';

export default function LayPeopleScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        icon="account-multiple"
        title="Laici"
        subtitle="Il cammino dei laici"
      />

      <Card>
        <Text style={styles.bodyText}>
          I laici dei Missionari della Via sono uomini e donne che, vivendo nel mondo,
          desiderano seguire Cristo con radicalità evangelica. Attraverso la meditazione
          quotidiana del Vangelo, cercano di incarnare la Parola nella vita di ogni giorno.
        </Text>
        <Text style={styles.bodyText}>
          Il cammino dei laici si caratterizza per la preghiera personale e comunitaria,
          la formazione permanente e l'impegno missionario nei propri ambienti di vita.
        </Text>
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
  bodyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
});
