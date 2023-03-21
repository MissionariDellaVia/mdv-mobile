import moment from 'moment';
import 'moment/locale/it';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const HomeScreen = ({navigation}) => {
  const {
    homeViewContainer,
    imageBG,
    currentDate,
    containerDate,
    homeButton,
    textButton,
  } = styles;

  const imageUrlBG = require('../assets/pergamena-background.jpeg');

  const homeButtonsArr = [
    {
      title: 'Chi Siamo',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'AboutUs',
    },
    {
      title: 'Via del Vangelo',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'Vangelo',
    },
    {
      title: 'Notizie',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'News',
    },
    {
      title: 'Appuntamenti',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'Meetings',
    },
  ];

  const today = () => {
    const now = moment().format('dddd DD MMMM YYYY');

    return now;
  };

  return (
    <View style={homeViewContainer}>
      <ImageBackground source={imageUrlBG} resizeMode="cover" style={imageBG}>
        {/* CONTAINER CURRENT DATA */}
        <View style={containerDate}>
          <Text style={currentDate}>{today()}</Text>
        </View>

        {/* HOME BUTTONS */}
        {homeButtonsArr.map((button, index) => {
          return (
            <TouchableHighlight
              key={index}
              style={{marginBottom: 20}}
              onPress={() => {
                navigation.navigate(button.action);
              }}>
              <View
                style={[homeButton, {backgroundColor: button.backgroundColor}]}>
                <Text style={[textButton, {color: button.textColor}]}>
                  {button.title}
                </Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  homeViewContainer: {
    flex: 1,
  },
  imageBG: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDate: {
    marginBottom: 30,
  },
  currentDate: {
    fontSize: 22,
    textTransform: 'capitalize',
  },
  homeButton: {
    minWidth: 200,
    padding: 10,
  },
  textButton: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
