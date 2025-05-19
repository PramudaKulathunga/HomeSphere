import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Switch
} from 'react-native';
import React, { useState } from 'react';
import { db, ref, update } from "../Components/firebase";

import Ionicons from 'react-native-vector-icons/Ionicons';
import Globles from '../Components/Globles';
const backGroundImg = require("../images/BackImg.png")

const SettingsScreen = ({ navigation }) => {

  const [darkMode, setDarkMode] = useState(1);
  const [isOn, setIsOn] = useState(true);

  {/*Update data to firebase*/ }
  const updateData = (name) => {
    const data = ref(db);
    update(data, { DarkMode: name })
  };

  const darkToggle = () => {
    if (isOn) {
      setDarkMode(0)
    } else {
      setDarkMode(1)
    }
    setIsOn(isOn => !isOn)

    updateData(darkMode)
    Globles.tempDark = darkMode
    Globles.tumb = (darkMode == 0)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="lightblue" barStyle="default" />
      <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >

        <View style={styles.header}>
          <View style={styles.titleHeader}>
            <Ionicons name="settings" color={'black'} size={30} style={styles.mainIcon} />
            <Text style={styles.mainText}>Settings</Text>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Text style={[styles.title, { color: (Globles.tempDark == 1) ? 'black' : 'white' }]}>Dark mode</Text>
            <Switch style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.3 }], marginRight: '7%' }} trackColor={{ false: 'rgb(151,189,253)', true: 'lightgreen' }} value={Globles.tumb} onValueChange={darkToggle} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView >
  );
};

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
    marginTop: 5,
    opacity: 0.7
  },
  title: {
    marginLeft: '5%',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default SettingsScreen
