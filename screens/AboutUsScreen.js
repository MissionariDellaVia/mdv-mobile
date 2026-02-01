import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors, fonts, spacing} from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';

export default function AboutUsScreen({navigation}) {
  const items = [
    {
      title: 'Consacrati',
      subtitle: 'La vita consacrata nella comunità',
      icon: 'account-group',
      route: 'Consacrated',
    },
    {
      title: 'Laici',
      subtitle: 'Il cammino dei laici',
      icon: 'account-multiple',
      route: 'Lay',
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        icon="information-outline"
        title="Chi Siamo"
        subtitle="Missionari della Via"
      />

      {items.map(item => (
        <TouchableOpacity
          key={item.route}
          onPress={() => navigation.navigate(item.route)}
          activeOpacity={0.7}
        >
          <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textMuted}
              />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
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
  itemCard: {
    paddingVertical: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(193,123,60,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  itemSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
