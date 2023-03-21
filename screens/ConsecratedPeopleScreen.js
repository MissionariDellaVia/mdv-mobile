import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Dimensions, Linking} from 'react-native';
import axios from 'axios';
import {BASE_URL, WHO_CONSACRATEDS_ARE} from '../services/Endpoints';

import {WebView} from 'react-native-webview';

const ConsacratedPeopleScreen = ({navigation}) => {
  const {containerConsacrated, webViewContainer} = styles;

  const [webContent, setWebContent] = useState(
    '<p style="color:white">Loading Page...</p>',
  );

  const runFirst = `
      
      // ADD META TAG

      var meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.getElementsByTagName('head')[0].appendChild(meta);

      // END META TAG

      document.body.style.backgroundColor = '#874901'; 

      const imageElRight = document.querySelectorAll('.thumbnail_right');

      imageElRight.forEach(function(singleImage) {
        singleImage.style.margin =  '20px';
        singleImage.style.float =  'right';
      });

      const imageElLeft = document.querySelectorAll('.thumbnail_left');

      imageElLeft.forEach(function(singleImage) {
        singleImage.style.margin =  '20px';
        singleImage.style.float =  'left';
      });

      document.querySelector('div').style.clear = 'both';
      document.querySelector('div').style.paddingTop = '50px';

      document.querySelector('p:nth-child(4)').style.clear = 'both';

      true; // note: this is required, or you'll sometimes get silent failures
    `;

  useEffect(() => {
    (async () => {
      const endpoint = BASE_URL + WHO_CONSACRATEDS_ARE;

      const headers = {
        'Content-Type': 'application/json',
      };

      axios.get(endpoint, {headers: headers}).then(async res => {
        let arrWebContent = await res.data[0].property.split('|');
        setWebContent(arrWebContent[1]);
      });
    })();
  });

  return (
    <ScrollView style={{backgroundColor: '#874901'}}>
      <View style={containerConsacrated}>
        <View style={webViewContainer}>
          <WebView
            ref={() => {}}
            originWhitelist={['*']}
            source={{html: webContent}}
            onMessage={event => {}}
            injectedJavaScript={runFirst}
            javaScriptEnabled={true}
            allowFileAccessFromFileURLs={true}
            startInLoadingState={true}
            //renderLoading={() => <Loading />}
            mixedContentMode="compatibility"
            scalesPageToFit={Platform.OS === 'ios' ? false : true}
            style={{
              height: Dimensions.get('window').height - 70,
              width: Dimensions.get('window').width - 30,
              flex: 1,
            }}
            onShouldStartLoadWithRequest={event => {
              const isExternalLink =
                Platform.OS === 'ios' ? event.navigationType === 'click' : true;
              if (event.url.slice(0, 4) === 'http' && isExternalLink) {
                Linking.canOpenURL(event.url).then(supported => {
                  if (supported) {
                    Linking.openURL(event.url);
                  }
                });
                return false;
              }
              return true;
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerConsacrated: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#874901',
  },
  webViewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 60,
  },
});

export default ConsacratedPeopleScreen;