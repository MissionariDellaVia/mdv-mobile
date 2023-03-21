import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

const AboutUsScreen = ({ navigation }) => {

    const { 
        containerAbout ,
        imageBG,
        aboutUsButton,
        textButton
    } = styles

    const imageUrlBG = require('../assets/pergamena-background.jpeg');

    const aboutUsButtonsArr = [

        { 
        title: "Consacrati",
        backgroundColor: "#763902",
        textColor: "gold",
        action: "Consacrated"
    },
        { 
        title: "Laici",
        backgroundColor: "#763902",
        textColor: "gold",
        action: "Lay"
    }

    ];

    return (

        <View style={containerAbout}>

            <ImageBackground
                source={imageUrlBG}
                resizeMode="cover"
                style={imageBG}
            >
            
                {/* ABOUT US BUTTONS */}
                {aboutUsButtonsArr.map( (button, index) => {

                    return (

                        <TouchableHighlight 
                            key={index} 
                            style={{marginBottom: 20}}
                            onPress={() => {
                                navigation.navigate(button.action)
                            }}
                        >

                            <View 
                                style={
                                    [aboutUsButton, {backgroundColor: button.backgroundColor}]
                                }
                            >
                                <Text style={[textButton, {color: button.textColor}]}>{button.title}</Text>
                            </View>

                        </TouchableHighlight>

                    )

                })}

            </ImageBackground>

        </View>

    )

}

const styles = StyleSheet.create({

    containerAbout: {
        flex: 1
    },
    imageBG: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    aboutUsButton: {
        minWidth: 200,
        padding: 10
    },
    textButton: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase"
    }

})

export default AboutUsScreen;

