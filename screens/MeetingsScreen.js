import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Dimensions, Linking} from 'react-native';
import axios from 'axios';
import {BASE_URL, MEETINGS} from '../services/Endpoints';

import {WebView} from 'react-native-webview';

const MeetingsScreen = ({navigation}) => {
  const {containerMeetings, webViewContainer} = styles;

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

      true; // note: this is required, or you'll sometimes get silent failures
    `;

  useEffect(() => {
    (async () => {
      const endpoint = BASE_URL + MEETINGS;

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
      <View style={containerMeetings}>
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
  containerMeetings: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#874901',
  },
  webViewContainer: {
    flex: 1,
    paddingTop: 20,
  },
});

export default MeetingsScreen;
