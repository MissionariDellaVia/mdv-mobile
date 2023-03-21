import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Dimensions, Linking} from 'react-native';
import axios from 'axios';
import {BASE_URL, GOSPEL_WAY_PAGE} from '../services/Endpoints';
import moment from 'moment';
import 'moment/locale/it';

import {WebView} from 'react-native-webview';

const GospelWayScreen = ({navigation}) => {
  const {containerGospel, webViewContainer} = styles;

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

        const pEl = document.querySelectorAll('p:not(.noTransform)');

        pEl.forEach(function(singleEl) {
          singleEl.style.color =  'gold';
        });

        true; // note: this is required, or you'll sometimes get silent failures
    `;

  useEffect(() => {
    (async () => {
      let textToDisplay = '';
      const currentDay = moment().format('YYYY-MM-DD');
      const currentDayLiteral =
        '<p style="text-align: center; color: #fff; font-size:18px">Giorno ' +
        moment().format('DD MMMM YYYY') +
        '</p>';
      textToDisplay += currentDayLiteral;

      const endpoint =
        BASE_URL + GOSPEL_WAY_PAGE + '/' + currentDay + '/' + currentDay;

      const headers = {
        'Content-Type': 'application/json',
      };

      axios.get(endpoint, {headers: headers}).then(async res => {
        let arrWebContent = await res.data[0].property.split('|');

        textToDisplay +=
          '<p class="noTransform" style="text-align: center; color: #fff; font-size:18px">' +
          arrWebContent[1] +
          '</p>';

        textToDisplay +=
          '<p class="noTransform" style="text-align: center; color: #fff; font-size:18px">' +
          arrWebContent[2] +
          ': ' +
          arrWebContent[3] +
          '</p>';

        textToDisplay +=
          '<p class="noTransform" style="text-align: left; color: gold; font-size:16px; margin-top: 80px;">Dal Vangelo secondo ' +
          arrWebContent[4] +
          '</p>';

        let n = 5;

        arrWebContent.map((item, index) => {
          if (index > 4) {
            textToDisplay += item;
          }
        });

        setWebContent(textToDisplay);
      });
    })();
  });

  return (
    <ScrollView style={{backgroundColor: '#874901'}}>
      <View style={containerGospel}>
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
  containerGospel: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#874901',
    flexWrap: 'wrap',
  },
  webViewContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 60,
    flexWrap: 'wrap',
  },
});

export default GospelWayScreen;
