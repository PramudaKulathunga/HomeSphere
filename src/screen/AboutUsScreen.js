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
  Linking,
  Image,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, ref, onValue } from "../Components/firebase";

// Assets
const backGroundImg = require("../images/BackImg.png");
const logo = require("../images/logo.png");

// Team data
const teamMembers = [
  {
    name: 'K.M.P.S.Kulathunga - Bsc.Eng (UG)',
    role: 'App Developer',
    linkedin: 'https://www.linkedin.com/in/pramuda-kulathunga-8a04561ba'
  },
  {
    name: 'H.M.S.A.Bandara - Bsc.Eng (UG)',
    linkedin: 'https://www.linkedin.com/in/sasindu-amesh-35ba0b297'
  },
  {
    name: 'H.M.D.S.Darmadasa - Bsc.Eng (UG)',
    linkedin: 'https://www.linkedin.com/in/dulara-srimantha-3ab464246'
  }
];

const AboutUsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(1);
  const backgroundColor = !isDarkMode ? 'rgba(0,0,0,0.69)' : 'rgba(255, 255, 255, 0.85)';
  const headerBgColor = !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
  const textColor = isDarkMode ? 'black' : '#fff';
  const iconColor = !isDarkMode ? '#fff' : '#fff';
  const memberContainer = !isDarkMode ? 'rgb(107, 64, 176)' : 'rgba(217, 182, 255, 0.66)';
  const linkText = !isDarkMode ? '#C4B5FD' : '#9333EA';
  const logoText = !isDarkMode ? '#C4B5FD' : '#9333EA';

  useEffect(() => {
    const data = ref(db);
    onValue(data, (snapshot) => {
      const val = snapshot.val();
      setIsDarkMode(val.DarkMode);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={headerBgColor}
        barStyle={"light-content"}
      />

      <ImageBackground
        source={backGroundImg}
        style={styles.backgroundImage}
        blurRadius={isDarkMode ? 0 : 2}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <View style={styles.headerContent}>
            <Ionicons
              name="information-circle"
              color={iconColor}
              size={24}
              style={styles.headerIcon}
            />
            <Text style={[styles.headerTitle, { color: iconColor }]}>
              ABOUT US
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
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ELECROAM Team Details:
          </Text>

          {teamMembers.map((member, index) => (
            <View key={index} style={[styles.memberContainer, { backgroundColor: memberContainer }]}>
              <Text style={[styles.memberName, { color: textColor }]}>
                {member.name}
              </Text>
              {member.role && (
                <Text style={[styles.memberRole, { color: textColor }]}>
                  ({member.role})
                </Text>
              )}
              <TouchableOpacity
                onPress={() => Linking.openURL(member.linkedin)}
                activeOpacity={0.6}
              >
                <Text style={[styles.linkText, { color: linkText }]}>View LinkedIn Profile</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.versionText, { color: logoText }]}>
              VERSION 1.0.1
            </Text>
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
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  memberContainer: {
    marginBottom: 20,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 145, 226, 0.26)',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  linkText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AboutUsScreen;