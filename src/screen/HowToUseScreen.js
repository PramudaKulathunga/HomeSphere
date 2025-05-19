import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import React from 'react';
import Globles from '../Components/Globles';

import Ionicons from 'react-native-vector-icons/Ionicons';
const backGroundImg = require("../images/BackImg.png")

const HowToUseScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="default" />
      <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >

        <View style={styles.header}>
          <View style={styles.titleHeader}>
            <Ionicons name="chatbubbles-sharp" color={'black'} size={30} style={styles.mainIcon} />
            <Text style={styles.mainText}>HOW TO USE</Text>
          </View>

          <View style={styles.homeHeader}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => navigation.goBack('HomeScreen')}
            >
              <Ionicons name="chevron-back-outline" color={'black'} size={20} style={styles.arrowIcon} />
              <Text style={[styles.mainText, styles.homeText]}>HOME</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: (Globles.tempDark == 0) ? 'black' : 'white' }]}>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Step 01:</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Make sure your power connection for Esp32 board to start the home circuit base on Arduino.</Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Step 02:</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Next check the wifi connection for Esp32 board to connect between app and circuit.</Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Step 03:</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>You can connect maximum 5 ports and after you are able to see data about ports such as voltage use, current use, power, frequency and rms value.</Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Rename</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>You can rename user ports as you wish.</Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Plug switch buttons</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>You can on or off each 5 ports by doubble pressing floating tabs. If you manually turn on or off each ports by circuit it will display here.</Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Analysis</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Here, you have facility to analyze your data what are you used.</Text>
          <View style={{ height: 40 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  statusbar: {
    backgroundColor: 'lightblue',
    barStyle: 'default',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: 'rgb(151,189,253)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  titleHeader: {
    flexDirection: 'row',
    marginLeft: 15
  },
  homeHeader: {
    marginRight: 13
  },
  mainIcon: {
    marginTop: 10,
  },
  mainText: {
    marginTop: 8,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black'
  },
  homeText: {
    fontSize: 18,
    marginTop: 13,
    marginLeft: 5,
  },
  arrowIcon: {
    marginTop: 16,
  },
  content: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    marginTop: 5,
    opacity: 0.7
  },
  title: {
    marginLeft: '5%',
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  subTitle: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 10,
    fontSize: 18,
    color: 'black'
  }
});

export default HowToUseScreen
