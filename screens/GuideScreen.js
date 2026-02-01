import React from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import AccordionItem from '../components/AccordionItem';

export default function GuideScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        icon="book-open-variant"
        title="Guida all'uso"
        subtitle="Come utilizzare al meglio l'applicazione"
      />

      <AccordionItem icon="download" title="Installare l'app">
        <Text style={styles.body}>
          Puoi installare l'app scaricandola dall'App Store (iOS) o dal Google Play Store (Android).
          Cerca "Missionari della Via" e tocca "Installa". Una volta installata, aprila e inizia
          a navigare tra le sezioni disponibili.
        </Text>
      </AccordionItem>

      <AccordionItem icon="magnify-plus-outline" title="Usare lo zoom">
        <Text style={styles.body}>
          Nella sezione Vangelo trovi una barra in basso con i controlli per lo zoom.
          Usa i pulsanti "−" e "+" per diminuire o aumentare la dimensione del testo.
          La percentuale al centro indica il livello di zoom corrente.
        </Text>
      </AccordionItem>

      <AccordionItem icon="refresh" title="Ricaricare la pagina">
        <Text style={styles.body}>
          Se il contenuto non si carica correttamente, puoi scorrere verso il basso e rilasciare
          per aggiornare la pagina. In alternativa, passa a un'altra scheda e torna indietro
          per forzare il ricaricamento dei dati.
        </Text>
      </AccordionItem>

      <AccordionItem icon="lead-pencil" title="Evidenziare il testo">
        <Text style={styles.body}>
          Nella sezione Vangelo, tocca l'icona della matita nella barra degli strumenti in basso.
          Seleziona il testo che vuoi evidenziare. Le tue evidenziature saranno salvate e
          visibili nella sezione "Evidenziature".
        </Text>
      </AccordionItem>
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
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
  },
});
