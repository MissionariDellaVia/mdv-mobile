import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import {getHighlights, removeHighlight} from '../services/HighlightService';

export default function HighlightsScreen() {
  const [highlights, setHighlights] = useState([]);

  useFocusEffect(
    useCallback(() => {
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

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        icon="pen"
        title="Le tue Evidenziature"
      />

      {highlights.length === 0 ? (
        <Card>
          <Text style={styles.emptyTitle}>
            Non hai ancora evidenziato nessun testo.
          </Text>
          <Text style={styles.emptySubtitle}>
            Seleziona del testo nella sezione Vangelo per evidenziarlo.
          </Text>
        </Card>
      ) : (
        highlights.map(item => (
          <Card key={item.id}>
            <View style={styles.highlightHeader}>
              <Text style={styles.highlightDate}>{item.date}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.highlightText}>{item.text}</Text>
          </Card>
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
  emptyTitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  highlightDate: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  highlightText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
  },
});
