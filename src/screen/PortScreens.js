import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  RefreshControl
} from 'react-native';
import { useEffect, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Globles from '../Components/Globles';
import { db, ref, onValue } from "../Components/firebase";
import Choose from '../Components/Choose';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const backGroundImg = require("../images/PortBackImg.png")

const maxVoltage = 300;
const maxCurrent = 15;
const maxPower = 20;
const maxFrequency = 75;
const maxPowerFactor = 1;

const PortScreens = ({ navigation }) => {

  const [refresh, setReafresh] = useState(false);
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0);
  const [port, setPort] = useState(0);

  useEffect(() => {
    const data = ref(db);

    if (Globles.tempId == 1) {
      onValue(data, (snapshot) => {
        setVoltage(snapshot.val().Voltage.Voltage1);
        setCurrent(snapshot.val().Current.Current1);
        setPower(snapshot.val().Power.Power1);
        setFrequency(snapshot.val().Frequency.Frequency1);
        setPowerFactor(snapshot.val().PowerFactor.PowerFactor1);
      });
    }
    else if (Globles.tempId == 2) {
      onValue(data, (snapshot) => {
        setVoltage(snapshot.val().Voltage.Voltage2);
        setCurrent(snapshot.val().Current.Current2);
        setPower(snapshot.val().Power.Power2);
        setFrequency(snapshot.val().Frequency.Frequency2);
        setPowerFactor(snapshot.val().PowerFactor.PowerFactor2);
      });
    }
    else if (Globles.tempId == 3) {
      onValue(data, (snapshot) => {
        setVoltage(snapshot.val().Voltage.Voltage3);
        setCurrent(snapshot.val().Current.Current3);
        setPower(snapshot.val().Power.Power3);
        setFrequency(snapshot.val().Frequency.Frequency3);
        setPowerFactor(snapshot.val().PowerFactor.PowerFactor3);
      });
    }
    else if (Globles.tempId == 4) {
      onValue(data, (snapshot) => {
        setVoltage(snapshot.val().Voltage.Voltage4);
        setCurrent(snapshot.val().Current.Current4);
        setPower(snapshot.val().Power.Power4);
        setFrequency(snapshot.val().Frequency.Frequency4);
        setPowerFactor(snapshot.val().PowerFactor.PowerFactor4);
      });
    }
    else if (Globles.tempId == 5) {
      onValue(data, (snapshot) => {
        setVoltage(snapshot.val().Voltage.Voltage5);
        setCurrent(snapshot.val().Current.Current5);
        setPower(snapshot.val().Power.Power5);
        setFrequency(snapshot.val().Frequency.Frequency5);
        setPowerFactor(snapshot.val().PowerFactor.PowerFactor5);
      });
    }
    onValue(data, (snapshot) => {
      setPort(snapshot.val().Port);
    });
  }, [db]);

  {/*pull refresh*/ }
  const pullMe = () => {
    setReafresh(true)
    setTimeout(() => {
      setReafresh(false)
    }, 1500)
  }
  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="lightblue" barStyle="default" />
            <View style={styles.header}>
        <View style={styles.titleHeader}>
          <MaterialCommunityIcons name={'usb-port'} color={'black'} size={45} style={styles.mainIcon} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.mainText}>PORTS</Text>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="caret-forward-outline" color={'black'} size={15} style={{ marginLeft: 35 }} />
              <Text style={styles.subMainText}>{Globles.tempName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.homeHeader}>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => [navigation.goBack('HomeScreen'), Choose(1,0)]}
          >
            <Ionicons name="chevron-back-outline" color={'black'} size={20} style={styles.arrowIcon} />
            <Text style={[styles.mainText, styles.homeText]}>HOME</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => pullMe()}
            />
          }>
          <View style={{ backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black', width: '100%', height: '100%', opacity: 0.7, marginTop: 5 }}>

            <View style={{ height: 15 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, marginBottom: 35 }}>
              <View style={styles.container2}>
                <AnimatedCircularProgress size={120} width={15} fill={voltage * (100 / maxVoltage)} duration={2000} delay={20} lineCap='round' tintColor='blue' backgroundColor='lightblue' />
                <Text style={styles.curveInText}>{voltage} V</Text>
                <Text style={[styles.curveInText, styles.curveOutText, { color: (Globles.tempDark == 0) ? 'white' : 'black' }]}>Voltage</Text>
              </View>
              <View style={styles.container2}>
                <AnimatedCircularProgress size={120} width={15} fill={current * (100 / maxCurrent)} duration={2000} delay={20} lineCap='round' tintColor='red' backgroundColor='rgb(255,147,150)' />
                <Text style={[styles.curveInText, { color: 'red' }]}>{current} mA</Text>
                <Text style={[styles.curveInText, styles.curveOutText, { color: (Globles.tempDark == 0) ? 'white' : 'black' }]}>Current</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
              <View style={styles.container2}>
                <AnimatedCircularProgress size={120} width={15} fill={power * (100 / maxPower)} duration={2000} delay={20} lineCap='round' tintColor='rgb(255,181,9)' backgroundColor='rgb(255,213,113)' />
                <Text style={[styles.curveInText, { color: 'rgb(255,181,9)' }]}>{power} W</Text>
                <Text style={[styles.curveInText, styles.curveOutText, { color: (Globles.tempDark == 0) ? 'white' : 'black' }]}>Power</Text>
              </View>
              <View style={styles.container2}>
                <AnimatedCircularProgress size={120} width={15} fill={frequency * (100 / maxFrequency)} duration={2000} delay={20} lineCap='round' tintColor='rgb(20,255,55)' backgroundColor='rgb(136,255,154)' />
                <Text style={[styles.curveInText, { color: 'rgb(20,255,55)' }]}>{frequency} Hz</Text>
                <Text style={[styles.curveInText, styles.curveOutText, { color: (Globles.tempDark == 0) ? 'white' : 'black' }]}>Frequency</Text>
              </View>
            </View>
            <View style={styles.container3}>
              <AnimatedCircularProgress size={120} width={15} fill={powerFactor * (100 / maxPowerFactor)} duration={2000} delay={20} lineCap='round' tintColor='rgb(220,21,255)' backgroundColor='rgb(240,153,255)' />
              <Text style={[styles.curveInText, { color: 'rgb(220,21,255)' }]}>{powerFactor}</Text>
              <Text style={[styles.curveInText, styles.curveOutText, { color: (Globles.tempDark == 0) ? 'white' : 'black' }]}>Power Factor</Text>
            </View>
            <View style={{ height: 35 }} />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.port}
          onPress={() => [navigation.navigate('AnalysisScreen'), Choose(3,(port))]}
        >
          <Text style={styles.portName}>Analysis</Text>
          <Ionicons name="chevron-forward-outline" color={'black'} size={25} style={styles.arrowIcon2} />
        </TouchableOpacity>

        <View style={{ backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black', width: '100%', height: '12%', opacity: 0.7, marginTop: 5 }} />
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
  },
  header: {
    height: 70,
    backgroundColor: 'rgb(204,254,217)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:35,
  },
  titleHeader: {
    flexDirection: 'row',
    marginLeft: 15
  },
  homeHeader: {
    marginRight: 13
  },
  mainIcon: {
    marginTop: 14,
  },
  mainText: {
    marginTop: 9,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black'
  },
  subMainText: {
    marginLeft: 5,
    marginTop: -5,
    fontSize: 18,
    color: 'black'
  },
  homeText: {
    fontSize: 18,
    marginTop: 21,
    marginLeft: '3%',
  },
  arrowIcon: {
    marginTop: 24,
  },
  content: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 15,
    color: 'black'
  },
  container2: {
    width: 125,
    height: 125
  },
  container3: {
    width: '100%',
    height: 160,
    marginTop: 55,
    alignContent: 'center',
    alignItems: 'center'
  },
  curveInText: {
    textAlign: 'center',
    color: 'blue',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: -75
  },
  curveOutText: {
    fontSize: 23,
    marginTop: 45,
    color: 'black'
  },
  port: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(204,254,217)',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portName: {
    marginLeft: 40,
    marginTop: 8,
    fontSize: 22,
    color: 'black',
    maxHeight: 'auto',
    fontWeight: 'bold'
  },
  arrowIcon2: {
    marginTop: 12,
    marginRight: '5%'
  },
});

export default PortScreens
