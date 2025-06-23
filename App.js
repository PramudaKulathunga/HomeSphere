/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Alert, Text, TouchableOpacity, StyleSheet, NativeModules, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, ref, update, onValue } from "./src/Components/firebase";
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { listenToAllPorts } from './src/Components/storage';

import OnboardingScreen from './src/screen/OnboardingScreen';
import HomeScreen from './src/screen/HomeScreen';
import AboutUsScreen from './src/screen/AboutUsScreen';
import HowToUseScreen from './src/screen/HowToUseScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import PortScreens from './src/screen/PortScreens';
import AnalysisScreen from './src/screen/AnalysisScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FirstSubmit = () => {
  const data = ref(db);
  update(data, { Port1: 'Port 1' })
  update(data, { Port2: 'Port 2' })
  update(data, { Port3: 'Port 3' })
  update(data, { Port4: 'Port 4' })
  update(data, { Port5: 'Port 5' })
  update(data, { DarkMode: 1 });
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  // Filter out screens that shouldn't appear in tab bar
  const filteredRoutes = state.routes.filter(
    route => route.name !== 'PortScreens' && route.name !== 'AnalysisScreen'
  );

  const [isDarkMode, setIsDarkMode] = useState(1);

  useEffect(() => {
    const data = ref(db);
    onValue(data, (snapshot) => {
      const val = snapshot.val();
      setIsDarkMode(val.DarkMode);
    });
  }, []);

  return (
    <View style={[
      styles.tabBarContainer,
      { backgroundColor: !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)' }
    ]}>
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        const tabLabel = route.name === 'HomeScreen' ? 'Home' :
          route.name === 'AboutUs' ? 'About' :
            route.name === 'HowToUse' ? 'Help' :
              route.name === 'Settings' ? 'Settings' : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <View style={styles.tabContent}>
              {options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? 'rgb(255, 255, 255)' : 'rgb(220, 187, 251)',
                size: 24
              })}
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? 'rgb(255, 255, 255)' : 'rgb(220, 187, 251)' }]}>
                {tabLabel}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AboutUs') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'HowToUse') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="HowToUse" component={HowToUseScreen} />
      <Tab.Screen name="AboutUs" component={AboutUsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="PortScreens" component={PortScreens} />
      <Tab.Screen name="AnalysisScreen" component={AnalysisScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAppFirstLaunched, setIsAppFirstLaunch] = React.useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      listenToAllPorts();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  {/*Onboarding screen launching*/ }
  React.useEffect(() => {
    async function check() {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched');
      if (appData == null) {
        FirstSubmit();
        setIsAppFirstLaunch(true);
        AsyncStorage.setItem('isAppFirstLaunched', 'false');
      } else {
        setIsAppFirstLaunch(false);
      }
    }
    check()
  }, [])

  {/*Wifi connection checking*/ }
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('No Internet!', 'Please check your network status', [
          { text: 'Reload App', onPress: () => NativeModules.DevSettings.reload() },
          { text: 'OK', onPress: () => BackHandler.exitApp(), style: 'cancel' }
        ]);
      }
    });

    return () => unsubscribe(); // Proper cleanup
  }, []);

  const MainTabsWrapper = (props) => <MainTabs {...props} />;

  return (
    isAppFirstLaunched != null && (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAppFirstLaunched && (
            <Stack.Screen
              name='OnboardingScreen'
              component={OnboardingScreen}
              options={{ gestureEnabled: false }}
            />
          )}
          <Stack.Screen name="MainTabs" component={MainTabsWrapper} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  );

};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    paddingBottom: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default App;