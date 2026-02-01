import React, {useRef, useCallback} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import AccordionItem from '../components/AccordionItem';

export default function GuideScreen() {
  const scrollRef = useRef(null);
  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({y: 0, animated: false});
  }, []));

  return (
    <ScrollView ref={scrollRef} style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Guida all'uso"
        subtitle="Come utilizzare al meglio l'applicazione"
      />

      <AccordionItem icon="magnify-plus-outline" title="Usare lo zoom">
        <Text style={styles.body}>
          Nella sezione "Vangelo del Giorno" trovi una barra degli strumenti fissa in basso allo schermo.{'\n\n'}
          I pulsanti "−" e "+" servono per diminuire o aumentare la dimensione del testo del Vangelo, del commento e delle riflessioni.{'\n\n'}
          La percentuale mostrata al centro (es. 100%) indica il livello di zoom corrente. Puoi ingrandire fino al 200% e ridurre fino all'80%.{'\n\n'}
          Tocca la freccia in alto per tornare rapidamente all'inizio della pagina.
        </Text>
      </AccordionItem>

      <AccordionItem icon="lead-pencil" title="Evidenziare il testo">
        <Text style={styles.body}>
          Nella sezione "Vangelo del Giorno", tocca l'icona della matita (evidenziatore) nella barra degli strumenti in basso. Si attiverà la modalità evidenziatura.{'\n\n'}
          Quando la modalità è attiva, vedrai un messaggio in alto che ti invita a selezionare il testo. Tieni premuto su una parola del Vangelo, del commento o delle riflessioni, poi trascina per selezionare il testo che desideri evidenziare.{'\n\n'}
          Quando hai selezionato il testo, comparirà il pulsante "Evidenzia" in basso: toccalo per salvare la tua evidenziatura.{'\n\n'}
          Il testo evidenziato resterà colorato in oro nella pagina del Vangelo, così potrai riconoscerlo subito quando torni a leggere.{'\n\n'}
          Per disattivare la modalità, tocca di nuovo l'icona della matita.
        </Text>
      </AccordionItem>

      <AccordionItem icon="bookmark-outline" title="Gestire le evidenziature">
        <Text style={styles.body}>
          Tutte le evidenziature salvate sono visibili nella sezione "Evidenziature" (tab in basso).{'\n\n'}
          Le evidenziature sono raggruppate per data del Vangelo. Per ogni evidenziatura vedrai il testo salvato, la sezione di provenienza (Vangelo, Commento o Riflessione) e la data in cui l'hai salvata.{'\n\n'}
          Per eliminare un'evidenziatura puoi scorrere la card verso sinistra (swipe) oppure toccare la "X" in alto a destra. Una volta eliminata, il testo non sarà più evidenziato nella pagina del Vangelo.
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
    fontSize: 20,
    color: colors.textDark,
    lineHeight: 32,
  },
});
