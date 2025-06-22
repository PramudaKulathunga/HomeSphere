import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, ref, onValue, update } from "../Components/firebase";

const backGroundImg = require("../images/BackImg.png");

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current dark mode setting from Firebase
  useEffect(() => {
    const data = ref(db);
    const unsubscribe = onValue(data, (snapshot) => {
      const currentMode = snapshot.val().DarkMode;
      setIsDarkMode(currentMode === 0);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update dark mode setting in Firebase
  const updateDarkMode = (isDark) => {
    const modeValue = isDark ? 0 : 1;
    update(ref(db), { DarkMode: modeValue });
  };

  const handleToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    updateDarkMode(newMode);
  };

  // Theme variables
  const backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.69)' : 'rgba(255, 255, 255, 0.85)';
  const headerBgColor = isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
  const textColor = !isDarkMode ? 'black' : '#fff';
  const iconColor = !isDarkMode ? '#fff' : '#fff';


  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
        <StatusBar backgroundColor={headerBgColor} barStyle={"light-content"} />
        <View style={styles.loadingContainer}>
          <Ionicons name="settings" size={40} color={iconColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Loading Settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              name="settings"
              color={iconColor}
              size={24}
              style={styles.headerIcon}
            />
            <Text style={[styles.headerTitle, { color: iconColor }]}>
              SETTINGS
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
          {/* Dark Mode Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={24}
                color={textColor}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingTitle, { color: textColor }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              style={styles.switch}
            />
          </View>

          {/* Additional settings can be added here */}
          {/* Example:
          <View style={styles.settingItem}>
            <Text style={[styles.settingTitle, { color: textColor }]}>
              Notification Settings
            </Text>
            <Ionicons name="chevron-forward" size={20} color={textColor} />
          </View>
          */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74,144,226,0.2)',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

export default SettingsScreen;