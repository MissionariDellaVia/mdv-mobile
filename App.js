import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  BarlowSemiCondensed_400Regular,
  BarlowSemiCondensed_500Medium,
  BarlowSemiCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-semi-condensed';
import * as SplashScreen from 'expo-splash-screen';
import {View, ActivityIndicator, StyleSheet, Platform, Image, Animated} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import GospelWayScreen from './screens/GospelWayScreen';
import HighlightsScreen from './screens/HighlightsScreen';
import GuideScreen from './screens/GuideScreen';
import {colors} from './theme';
import {getHighlightCount} from './services/HighlightService';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function GlowingIcon({source, size, color}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {toValue: 1, duration: 1200, useNativeDriver: true}),
        Animated.timing(anim, {toValue: 0, duration: 1200, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const tintColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [color, colors.light],
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Animated.Image
      source={source}
      style={{width: size, height: size, tintColor, transform: [{scale}]}}
    />
  );
}

function getTabIcon(routeName, focused, color, size) {
  switch (routeName) {
    case 'Home':
      return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
    case 'ChiSiamo':
      return <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={size} color={color} />;
    case 'Vangelo':
      if (focused) {
        return <Image source={require('./assets/gospel.png')} style={{width: size, height: size, tintColor: color}} />;
      }
      return <GlowingIcon source={require('./assets/gospel.png')} size={size} color={color} />;
    case 'Evidenziature':
      return <MaterialCommunityIcons name={focused ? 'lead-pencil' : 'pencil-outline'} size={size} color={color} />;
    case 'Guida':
      return <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={size} color={color} />;
    default:
      return null;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    BarlowSemiCondensed_400Regular,
    BarlowSemiCondensed_500Medium,
    BarlowSemiCondensed_600SemiBold,
    SaveTheDateSansBold: require('./assets/save-the-date-sans-bold.otf'),
  });
  const [highlightCount, setHighlightCount] = useState(0);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <NavigationContainer
        linking={{
          prefixes: ['mdv://'],
          config: {
            screens: {
              Vangelo: 'gospel/:date',
            },
          },
        }}
      >
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) =>
              getTabIcon(route.name, focused, color, size),
            tabBarActiveTintColor: colors.dark,
            tabBarInactiveTintColor: colors.background,
            tabBarStyle: {
              backgroundColor: colors.cardBackground,
              borderTopColor: 'rgba(255,255,255,0.15)',
              paddingTop: Platform.OS === 'ios' ? 12 : 8,
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              height: Platform.OS === 'ios' ? 90 : 72,
            },
            tabBarLabelStyle: {
              fontFamily: 'BarlowSemiCondensed_500Medium',
              fontSize: 11,
            },
            headerShown: false,
            animation: 'none',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="ChiSiamo"
            component={AboutUsScreen}
            options={{tabBarLabel: 'Chi siamo'}}
          />
          <Tab.Screen name="Vangelo" component={GospelWayScreen} />
          <Tab.Screen
            name="Evidenziature"
            component={HighlightsScreen}
            options={{
              tabBarBadge: highlightCount > 0 ? highlightCount : undefined,
              tabBarBadgeStyle: {backgroundColor: colors.primary, fontSize: 11},
            }}
            listeners={{
              tabPress: async () => {
                const count = await getHighlightCount();
                setHighlightCount(count);
              },
            }}
          />
          <Tab.Screen name="Guida" component={GuideScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
