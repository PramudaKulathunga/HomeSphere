/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, ref, update } from "./src/Components/firebase";
import NetInfo from '@react-native-community/netinfo';
import Restart from 'react-native-restart';

import OnbordingScreen from './src/screen/OnboardingScreen';
import HomeScreen from './src/screen/HomeScreen';
import AboutUsScreen from './src/screen/AboutUsScreen';
import HowToUseScreen from './src/screen/HowToUseScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import PortScreens from './src/screen/PortScreens';
import AnalysisScreen from './src/screen/AnalysisScreen';
const Stack = createStackNavigator();

const App = () => {
    const [isAppFirstLaunched, setIsAppFirstLaunch] = React.useState(null);

    const Firstsubmit = () => {
      const data = ref(db);
      update(data, { Port1: 'Port 1' })
      update(data, { Port2: 'Port 2' })
      update(data, { Port3: 'Port 3' })
      update(data, { Port4: 'Port 4' })
      update(data, { Port5: 'Port 5' })
      update(data, { DarkMode: (1) })
    }

    {/*Onboarding screen launching*/ }
    React.useEffect(() => {
      async function check() {
        const appData = await AsyncStorage.getItem('isAppFirstLaunched');
        if (appData == null) {
          Firstsubmit();
          setIsAppFirstLaunch(true);
          AsyncStorage.setItem('isAppFirstLaunched', 'false');
        } else {
          setIsAppFirstLaunch(false);
        }
      }
      check()
    }, [])

    {/*Wifi connection checking*/ }
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
        Alert.alert('No Internet!', 'Please check your network status', [
          {
            text: 'Reload App',
            onPress: () => Restart.restart(),
          },
        ]);
      } else if (state.isConnected === true) {

      }
    })

    useEffect(() => {
      unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      isAppFirstLaunched != null && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAppFirstLaunched && (
              <Stack.Screen name='OnboardingScreen' component={OnbordingScreen} />
            )}
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='AboutUsScreen' component={AboutUsScreen} />
            <Stack.Screen name='HowToUseScreen' component={HowToUseScreen} />
            <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
            <Stack.Screen name='PortScreens' component={PortScreens} />
            <Stack.Screen name='AnalysisScreen' component={AnalysisScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    );

};

export default App;
