import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db, ref, onValue } from "../Components/firebase";
import DropDownPicker from 'react-native-dropdown-picker';

const backGroundImg = require("../images/BackImg.png");

const METER_LIMITS = {
  voltage: { max: 300, color: '#4285F4', bgColor: '#E8F0FE' },
  current: { max: 15, color: '#EA4335', bgColor: '#FDECEE' },
  power: { max: 20, color: '#FBBC05', bgColor: '#FEF7E0' },
  frequency: { max: 75, color: '#34A853', bgColor: '#E6F4EA' },
  powerFactor: { max: 1, color: '#9B51E0', bgColor: '#F3E8FD' }
};

const PortDropdown = ({ selectedPort, setSelectedPort, isDarkMode, portNames, switchData }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedPort);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setValue(selectedPort);
  }, [selectedPort]);

  useEffect(() => {
    if (portNames && switchData) {
      const generatedItems = portNames.map((name, index) => ({
        label: name,
        value: index + 1,
        disabled: switchData[index] === 0
      }));
      setItems(generatedItems);
    }
  }, [portNames, switchData]);

  useEffect(() => {
    if (value) {
      setSelectedPort(value);
    }
  }, [value]);

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select Port"
        zIndex={3000}
        zIndexInverse={1000}
        dropDownDirection="AUTO"
        style={[
          styles.analysisButton,
          {
            backgroundColor: isDarkMode ? 'rgb(166, 108, 229)' : 'rgb(107, 64, 176)',
            width: 120,
            borderWidth: 0
          }
        ]}
        dropDownContainerStyle={{
          backgroundColor: isDarkMode ? 'rgb(166, 108, 229)' : 'rgb(107, 64, 176)',
        }}
        textStyle={[
          styles.analysisButtonText,
          { color: isDarkMode ? 'black' : '#fff' }
        ]}
        arrowIconStyle={{
          tintColor: isDarkMode ? 'black' : '#fff'
        }}
        disabledItemLabelStyle={{
          color: 'red'
        }}
      />
    </View>
  );
};

const PortScreen = ({ route, navigation }) => {
  const [selectedPortId, setSelectedPortId] = useState(null);
  const [portNames, setPortNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [portData, setPortData] = useState(null);
  const [switchData, setSwitchData] = useState([null]);
  const [isDarkMode, setIsDarkMode] = useState(1);

  useEffect(() => {
    setSelectedPortId(route.params.portId);
  }, [route.params.portId]);

  useEffect(() => {
    const data = ref(db);
    onValue(data, (snapshot) => {
      const val = snapshot.val();
      const ports = val.Ports || ["Port 1", "Port 2", "Port 3", "Port 4", "Port 5"];
      setPortNames(ports);
      setIsDarkMode(val.DarkMode);
      setSwitchData(val.Switches);
    });
  }, []);

  const loadPortDataFromStorage = async () => {
    try {
      if (switchData && switchData[selectedPortId - 1] === 0) {
        setPortData(null);
        setIsLoading(false);
        return;
      }

      const key = `port_${selectedPortId}_history`;
      const raw = await AsyncStorage.getItem(key);
      const history = raw ? JSON.parse(raw) : [];

      if (history.length > 0) {
        setPortData(history[history.length - 1]);
      } else {
        setPortData(null);
      }

    } catch (error) {
      console.error("Error loading port data from storage:", error);
      setPortData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadPortDataFromStorage();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPortId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force a data refresh
    loadPortDataFromStorage();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Dark mode colors
  const backgroundColor = !isDarkMode ? 'rgba(0,0,0,0.69)' : 'rgba(255, 255, 255, 0.85)';
  const headerBgColor = !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
  const textColor = isDarkMode ? 'black' : '#fff';
  const iconColor = !isDarkMode ? '#fff' : '#fff';
  const memberContainer = !isDarkMode ? 'rgb(107, 64, 176)' : 'rgb(166, 108, 229)';
  const loadingText = !isDarkMode ? '#fff' : 'rgb(91, 33, 182)';

  const renderGauge = (type, value) => {
    const { max, color, bgColor } = METER_LIMITS[type];
    const fillPercentage = (value / max) * 100;
    const unit = type === 'current' ? 'mA' :
      type === 'power' ? 'W' :
        type === 'frequency' ? 'Hz' :
          type === 'powerFactor' ? '' : 'V';

    return (
      <View style={styles.gaugeContainer}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={fillPercentage}
          duration={1000}
          lineCap="round"
          tintColor={color}
          backgroundColor={bgColor}
        />
        <Text style={[styles.gaugeValue, { color }]}>
          {value !== undefined ? value.toFixed(2) : '0.00'} {unit}
        </Text>
        <Text style={[styles.gaugeLabel, { color: textColor }]}>
          {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
        </Text>
      </View>
    );
  };

  if (isLoading || !portData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor={headerBgColor} barStyle="light-content" />

        <ImageBackground
          source={backGroundImg}
          style={styles.backgroundImage}
          blurRadius={isDarkMode ? 3 : 1}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: headerBgColor }]}>
            <View style={styles.headerContent}>
              <MaterialCommunityIcons
                name="usb-port"
                color="#fff"
                size={36}
                style={styles.headerIcon}
              />
              <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: iconColor }]}>PORTS</Text>
                <Ionicons name="chevron-forward" color="#fff" size={20} style={{ marginTop: 3 }} />
                {portNames && <Text style={[styles.headerTitle, { color: iconColor }]}>{portNames[selectedPortId - 1]}</Text>}
              </View>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" color="#fff" size={20} style={{ marginTop: 3 }} />
              <Text style={[styles.headerTitle, { color: iconColor }]}>HOME</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: '100%', backgroundColor }}>
            <ActivityIndicator size="large" style={{ marginTop: 50 }} />
            <Text style={[styles.loadingText, { color: loadingText }]}>Loading...</Text>

            {(switchData && switchData[selectedPortId - 1] === 0) &&
              <Text style={[styles.loadingText, { paddingHorizontal: 20, marginTop: 15, color: loadingText }]}>{portNames[selectedPortId - 1]} is off. Turn on to analyze the data.</Text>
            }
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={headerBgColor} barStyle="light-content" />

      <ImageBackground
        source={backGroundImg}
        style={styles.backgroundImage}
        blurRadius={isDarkMode ? 3 : 1}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name="usb-port"
              color="#fff"
              size={36}
              style={styles.headerIcon}
            />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: iconColor }]}>PORTS</Text>
              <Ionicons name="chevron-forward" color="#fff" size={20} style={{ marginTop: 3 }} />
              <Text style={[styles.headerTitle, { color: iconColor }]}>
                {portNames[selectedPortId - 1]}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" color="#fff" size={20} style={{ marginTop: 3 }} />
            <Text style={[styles.headerTitle, { color: iconColor }]}>HOME</Text>
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor }}>
          <View style={{ justifyContent: 'center', marginVertical: 10 }}>
            <TouchableOpacity
              style={[styles.analysisButton, { backgroundColor: memberContainer, height: 50 }]}
              onPress={() => navigation.navigate('AnalysisScreen', { selectedPortId })}
            >
              <Ionicons name="analytics-outline" size={20} color={textColor} />
              <Text style={[styles.analysisButtonText, { color: textColor }]}>View Analysis</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <PortDropdown
              selectedPort={selectedPortId}
              setSelectedPort={setSelectedPortId}
              isDarkMode={isDarkMode}
              portNames={portNames}
              switchData={switchData}
            />
          </View>
        </View>

        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#4a90e2"
            />
          }
        >

          <View style={styles.contentContainer}>
            <View style={styles.gaugeRow}>
              {renderGauge('voltage', portData.Voltage)}
              {renderGauge('current', portData.Current)}
            </View>

            <View style={styles.gaugeRow}>
              {renderGauge('power', portData.Power)}
              {renderGauge('frequency', portData.Frequency)}
            </View>

            <View style={styles.powerFactorContainer}>
              {renderGauge('powerFactor', portData.PowerFactor)}
            </View>
          </View>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    height: Platform.OS === 'ios' ? 90 : 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTextContainer: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  portNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  portName: {
    fontSize: 16,
    marginLeft: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  gaugeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  gaugeContainer: {
    alignItems: 'center',
    width: 120,
  },
  gaugeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -70,
    textAlign: 'center',
  },
  gaugeLabel: {
    fontSize: 18,
    marginTop: 45,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  powerFactorContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  historyContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  historyItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
  },
  analysisButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PortScreen;