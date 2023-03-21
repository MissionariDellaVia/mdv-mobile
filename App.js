import React, {useEffect} from 'react';
import {LogBox} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import VangeloWayScreen from './screens/VangeloWayScreen';
import ConsacratedPeopleScreen from './screens/ConsecratedPeopleScreen';
import LayPeopleScreen from './screens/LayPeopleScreen ';
import VangeloIntroductionScreen from './screens/VangeloIntroductionScreen';
import NewsScreen from './screens/NewsScreen';
import MeetingsScreen from './screens/MeetingsScreen';
import GospelWayScreen from './screens/GospelWayScreen';

import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  LogBox.ignoreLogs(['Remote debugger']);

  const homeStackOptions = {
    title: 'Missionari della via',
    headerTintColor: '#763902',
    headerTitleStyle: {
      fontSize: 20,
    },
    headerShown: true,
    headerTransparent: true,
  };

  const AboutUsStackOptions = {
    title: 'Chi Siamo',
    headerTintColor: '#763902',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerShown: true,
    headerTransparent: true,
    headerBackTitleVisible: false,
    headerLargeTitleStyle: {
      color: 'red',
    },
  };

  const VangeloStackOptions = {
    title: 'Via del vangelo',
    headerTintColor: '#763902',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerShown: true,
    headerTransparent: true,
    headerBackTitleVisible: false,
    headerLargeTitleStyle: {
      color: 'red',
    },
  };

  const ConsacratedStackOptions = {
    title: 'Consacrati',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    headerLargeTitleStyle: {
      color: 'red',
    },
  };

  const LayStackOptions = {
    title: 'Laici',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    // headerLargeTitleStyle: {
    //   color: 'red',
    // },
  };

  const VangeloIntroductionStackOptions = {
    title: 'Introduzione',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    // headerLargeTitleStyle: {
    //   color: 'red',
    // },
  };

  const NewsStackOptions = {
    title: 'News',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    // headerLargeTitleStyle: {
    //   color: 'red',
    // },
  };

  const MeetingsStackOptions = {
    title: 'Appuntamenti',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    // headerLargeTitleStyle: {
    //   color: 'red',
    // },
  };

  const GospelWayStackOptions = {
    title: 'Vangelo del giorno',
    headerTintColor: 'gold',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    headerStyle: {
      backgroundColor: '#874901',
    },
    headerShown: true,
    headerTransparent: false,
    headerBackTitleVisible: false,
    // headerLargeTitleStyle: {
    //   color: 'red',
    // },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={homeStackOptions}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={AboutUsStackOptions}
        />
        <Stack.Screen
          name="Vangelo"
          component={VangeloWayScreen}
          options={VangeloStackOptions}
        />
        <Stack.Screen
          name="Consacrated"
          component={ConsacratedPeopleScreen}
          options={ConsacratedStackOptions}
        />
        <Stack.Screen
          name="Lay"
          component={LayPeopleScreen}
          options={LayStackOptions}
        />
        <Stack.Screen
          name="VangeloIntroduction"
          component={VangeloIntroductionScreen}
          options={VangeloIntroductionStackOptions}
        />
        <Stack.Screen
          name="News"
          component={NewsScreen}
          options={NewsStackOptions}
        />
        <Stack.Screen
          name="Meetings"
          component={MeetingsScreen}
          options={MeetingsStackOptions}
        />
        <Stack.Screen
          name="GospelWayPage"
          component={GospelWayScreen}
          options={GospelWayStackOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
