import React, {useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';

dayjs.locale('it');

export default function DateSlider({dates, selectedDate, onSelectDate}) {
  const scrollRef = useRef(null);

  const selectedDayjs = dayjs(selectedDate);
  const monthLabel =
    selectedDayjs.format('MMMM YYYY').charAt(0).toUpperCase() +
    selectedDayjs.format('MMMM YYYY').slice(1);

  const selectedIndex = dates.findIndex(d => d === selectedDate);

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      const offset = Math.max(0, selectedIndex * 76 - 100);
      scrollRef.current.scrollTo({x: offset, animated: true});
    }
  }, [selectedIndex]);

  const goToPrev = () => {
    if (selectedIndex > 0) onSelectDate(dates[selectedIndex - 1]);
  };

  const goToNext = () => {
    if (selectedIndex < dates.length - 1) onSelectDate(dates[selectedIndex + 1]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.monthLabel}>{monthLabel}</Text>
      <View style={styles.sliderRow}>
        <TouchableOpacity onPress={goToPrev} style={styles.arrow}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.accent} />
        </TouchableOpacity>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {dates.map(date => {
            const d = dayjs(date);
            const isSelected = date === selectedDate;
            const dayName = d.format('ddd').toUpperCase().slice(0, 3);
            const dayNum = d.format('D');

            return (
              <TouchableOpacity
                key={date}
                onPress={() => onSelectDate(date)}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {dayName}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                  {dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={goToNext} style={styles.arrow}>
          <MaterialCommunityIcons name="chevron-right" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  monthLabel: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  dayItem: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: 'rgba(193,123,60,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayItemSelected: {
    backgroundColor: colors.accent,
  },
  dayName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  dayNameSelected: {
    color: colors.white,
  },
  dayNum: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.textDark,
  },
  dayNumSelected: {
    color: colors.white,
  },
});
