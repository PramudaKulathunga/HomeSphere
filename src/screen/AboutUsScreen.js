import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
  Image
} from 'react-native';
import React, { useState } from 'react';
import Globles from '../Components/Globles';

import Ionicons from 'react-native-vector-icons/Ionicons';
const backGroundImg = require("../images/BackImg.png")
const logo = require("../images/logo.png")

const AboutUsScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="default" />
      <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >
        <View style={styles.header}>
          <View style={styles.titleHeader}>
            <Ionicons name="people-sharp" color={'black'} size={30} style={styles.mainIcon} />
            <Text style={styles.mainText}>ABOUT US</Text>
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
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>ELECROAM Team Details:</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>K.M.P.S.Kulathunga - Bsc.Eng (UG)</Text>
          <Text style={[styles.subTitle, { color: 'blue' }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/pramuda-kulathunga-8a04561ba')}>
            See more details
          </Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>H.M.S.A.Bandara - Bsc.Eng (UG)</Text>
          <Text style={[styles.subTitle, { color: 'blue' }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/sasindu-amesh-35ba0b297')}>
            See more details
          </Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>H.M.D.S.Darmadasa - Bsc.Eng (UG)</Text>
          <Text style={[styles.subTitle, { color: 'blue' }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/dulara-srimantha-3ab464246')}>
            See more details
          </Text>
          <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>App Developer:</Text>
          <Text style={[styles.subTitle, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>K.M.P.S.Kulathunga - Bsc.Eng (UG)</Text>
          <Text style={[styles.subTitle, { color: 'blue' }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/pramuda-kulathunga-8a04561ba')}>
            See more details
          </Text>
          <View style={styles.logoContent}>
            <Image
              source={logo}
              style={{ width: 120, height: 120 }}
            />
            <Text style={{ fontWeight: 'bold', color: 'black', color: (Globles.tempDark == 1) ? 'black' : 'white' }}>VERSION 1.0.0</Text>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusbar: {
    backgroundColor: 'lightblue',
    barStyle: 'default',
  },
  container: {
    flex: 1,
    marginTop:35,
  },
  header: {
    height: 50,
    backgroundColor: 'rgb(151,189,253)',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginTop: 5,
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    opacity: 0.7
  },
  title: {
    marginLeft: '5%',
    marginTop: 15,
    marginBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  subTitle: {
    marginLeft: '10%',
    marginRight: '5%',
    marginTop: 3,
    fontSize: 18,
    color: 'black'
  },
  logoContent: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AboutUsScreen
