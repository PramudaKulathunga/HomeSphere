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
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, ref, onValue } from "../Components/firebase";

const backGroundImg = require("../images/BackImg.png");

// Instruction data
const instructions = [
  {
    title: "Step 01:",
    description: "Make sure your power connection for ESP32 board is properly set up to start the home circuit based on Arduino."
  },
  {
    title: "Step 02:",
    description: "Check the WiFi connection for ESP32 board to establish communication between the app and circuit."
  },
  {
    title: "Step 03:",
    description: "You can connect up to 5 ports and monitor data including voltage usage, current usage, power, frequency, and RMS values."
  },
  {
    title: "Rename Ports",
    description: "Customize your port names as needed for better organization."
  },
  {
    title: "Plug Switch Buttons",
    description: "Toggle each of the 5 ports by double-pressing the floating buttons. Manual circuit changes will be reflected in the app."
  },
  {
    title: "Analysis",
    description: "Utilize the analysis feature to review and understand your power consumption data."
  }
];

const HowToUseScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(1);
  const backgroundColor = !isDarkMode ? 'rgba(0,0,0,0.69)' : 'rgba(255, 255, 255, 0.85)';
  const headerBgColor = !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
  const textColor = isDarkMode ? 'black' : '#fff';
  const iconColor = !isDarkMode ? '#fff' : '#fff';
  const memberContainer = !isDarkMode ? 'rgb(107, 64, 176)' : 'rgba(217, 182, 255, 0.66)';


  useEffect(() => {
    const data = ref(db);
    onValue(data, (snapshot) => {
      const val = snapshot.val();
      setIsDarkMode(val.DarkMode);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={headerBgColor} barStyle={"light-content"} />

      <ImageBackground
        source={backGroundImg}
        style={styles.backgroundImage}
        blurRadius={isDarkMode ? 3 : 1}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <View style={styles.headerContent}>
            <Ionicons
              name="help-circle"
              color={iconColor}
              size={24}
              style={styles.headerIcon}
            />
            <Text style={[styles.headerTitle, { color: iconColor }]}>
              HOW TO USE
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              color={iconColor}
              size={20}
            />
            <Text style={[styles.backText, { color: iconColor }]}>
              HOME
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={[styles.content, { backgroundColor }]}
          contentContainerStyle={styles.scrollContent}
        >
          {instructions.map((item, index) => (
            <View key={index} style={[styles.instructionCard, { backgroundColor: memberContainer }]}>
              <Text style={[styles.instructionTitle, { color: textColor }]}>
                {item.title}
              </Text>
              <Text style={[styles.instructionText, { color: textColor }]}>
                {item.description}
              </Text>
            </View>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  instructionCard: {
    backgroundColor: 'rgba(74, 145, 226, 0.26)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HowToUseScreen;