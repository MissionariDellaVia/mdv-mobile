import React, {useCallback} from 'react';
import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import ConsecratedPeopleScreen from './screens/ConsecratedPeopleScreen';
import LayPeopleScreen from './screens/LayPeopleScreen';
import GospelWayScreen from './screens/GospelWayScreen';
import HighlightsScreen from './screens/HighlightsScreen';
import GuideScreen from './screens/GuideScreen';
import {colors} from './theme';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const AboutStack = createNativeStackNavigator();

function AboutStackNavigator() {
  return (
    <AboutStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.background},
        headerTintColor: colors.white,
        headerTitleStyle: {fontFamily: 'PlayfairDisplay_700Bold'},
      }}
    >
      <AboutStack.Screen
        name="AboutMain"
        component={AboutUsScreen}
        options={{headerShown: false}}
      />
      <AboutStack.Screen
        name="Consacrated"
        component={ConsecratedPeopleScreen}
        options={{title: 'Consacrati'}}
      />
      <AboutStack.Screen
        name="Lay"
        component={LayPeopleScreen}
        options={{title: 'Laici'}}
      />
    </AboutStack.Navigator>
  );
}

function getTabIcon(routeName, focused, color, size) {
  switch (routeName) {
    case 'Home':
      return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
    case 'ChiSiamo':
      return <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={size} color={color} />;
    case 'Vangelo':
      return <MaterialCommunityIcons name={focused ? 'book-open-variant' : 'book-open-outline'} size={size} color={color} />;
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
  });

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
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) =>
              getTabIcon(route.name, focused, color, size),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.white,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: 'rgba(255,255,255,0.1)',
              paddingBottom: 4,
              height: 60,
            },
            tabBarLabelStyle: {
              fontFamily: 'BarlowSemiCondensed_500Medium',
              fontSize: 11,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen
            name="ChiSiamo"
            component={AboutStackNavigator}
            options={{tabBarLabel: 'Chi siamo'}}
          />
          <Tab.Screen name="Vangelo" component={GospelWayScreen} />
          <Tab.Screen name="Evidenziature" component={HighlightsScreen} />
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
