import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const VangeloWayScreen = ({navigation}) => {
  const {containerVangelo, imageBG, vangeloButton, textButton} = styles;

  const imageUrlBG = require('../assets/pergamena-background.jpeg');

  const vangeloButtonsArr = [
    {
      title: 'Introduzione',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'VangeloIntroduction',
    },
    {
      title: 'Vangelo del giorno',
      backgroundColor: '#763902',
      textColor: 'gold',
      action: 'GospelWayPage',
    },
  ];

  return (
    <View style={containerVangelo}>
      <ImageBackground source={imageUrlBG} resizeMode="cover" style={imageBG}>
        {/* VANGELO WAY BUTTONS */}
        {vangeloButtonsArr.map((button, index) => {
          return (
            <TouchableHighlight
              key={index}
              style={{marginBottom: 20}}
              onPress={() => {
                navigation.navigate(button.action);
              }}>
              <View
                style={[
                  vangeloButton,
                  {backgroundColor: button.backgroundColor},
                ]}>
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
  containerVangelo: {
    flex: 1,
  },
  imageBG: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vangeloButton: {
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

export default VangeloWayScreen;
