import React, {useRef, useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import {colors, fonts, spacing} from '../theme';

dayjs.locale('it');

const VISIBLE_DAYS = 14;
const DAY_WIDTH = 60;
const DAY_GAP = 8;

function DayItem({date, isSelected, hasData, onSelect}) {
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 1)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  const handlePress = () => {
    scaleAnim.setValue(0.85);
    onSelect(date);
  };

  const d = dayjs(date);
  const dayName = d.format('ddd').toUpperCase().slice(0, 3);
  const dayNum = d.format('D');

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.dayItem,
          isSelected && styles.dayItemSelected,
          !hasData && !isSelected && styles.dayItemNoData,
          {transform: [{scale: scaleAnim}]},
        ]}
      >
        <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
          {dayName}
        </Text>
        <Text style={[
          styles.dayNum,
          isSelected && styles.dayNumSelected,
          !hasData && !isSelected && styles.dayNumNoData,
        ]}>
          {dayNum}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function DateSlider({dates, selectedDate, onSelectDate}) {
  const scrollRef = useRef(null);

  const selectedDayjs = dayjs(selectedDate);
  const monthLabel =
    selectedDayjs.format('MMMM YYYY').charAt(0).toUpperCase() +
    selectedDayjs.format('MMMM YYYY').slice(1);

  const visibleDays = useMemo(() => {
    const result = [];
    const halfWindow = Math.floor(VISIBLE_DAYS / 2);
    for (let i = -halfWindow; i <= halfWindow; i++) {
      result.push(selectedDayjs.add(i, 'day').format('YYYY-MM-DD'));
    }
    return result;
  }, [selectedDate]);

  const selectedIndex = visibleDays.findIndex(d => d === selectedDate);

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      const offset = Math.max(0, selectedIndex * (DAY_WIDTH + DAY_GAP) - 100);
      scrollRef.current.scrollTo({x: offset, animated: true});
    }
  }, [selectedIndex, selectedDate]);

  const goToPrev = () => {
    onSelectDate(selectedDayjs.subtract(1, 'day').format('YYYY-MM-DD'));
  };

  const goToNext = () => {
    onSelectDate(selectedDayjs.add(1, 'day').format('YYYY-MM-DD'));
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
          {visibleDays.map(date => {
            const isSelected = date === selectedDate;
            const hasData = dates.includes(date);

            return (
              <DayItem
                key={date}
                date={date}
                isSelected={isSelected}
                hasData={hasData}
                onSelect={onSelectDate}
              />
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
    gap: DAY_GAP,
  },
  dayItem: {
    width: DAY_WIDTH,
    height: 70,
    borderRadius: 12,
    backgroundColor: 'rgba(166,125,81,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayItemSelected: {
    backgroundColor: colors.accent,
  },
  dayItemNoData: {
    opacity: 0.5,
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
  dayNumNoData: {
    color: colors.textMuted,
  },
});
