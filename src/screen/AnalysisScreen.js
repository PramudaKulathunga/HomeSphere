import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Platform
} from 'react-native';
import GraphCard from '../Components/GraphCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { db, ref, onValue } from "../Components/firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const backGroundImg = require("../images/BackImg.png");

function PortSelector({ selectedPort, setSelectedPort, setSelectedPortMax, isDarkMode }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedPort);
    const [items, setItems] = useState([]);

    useEffect(() => {
        setValue(selectedPort);
    }, [selectedPort]);

    useEffect(() => {
        const data = ref(db);
        onValue(data, (snapshot) => {
            const val = snapshot.val();
            const fetchedNames = val.Ports || ["Port 1", "Port 2", "Port 3", "Port 4", "Port 5"];
            const switches = val.Switches || [0, 0, 0, 0, 0];

            const generatedItems = fetchedNames.map((name, index) => ({
                label: name,
                value: index + 1,
                disabled: switches[index] === 0
            }));
            setItems(generatedItems);
        });
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedPort(`port_${value}_history`);
            setSelectedPortMax(`port_${value}_max`);
        }
    }, [value]);

    return (
        <View style={{
            zIndex: 1000,
            marginBottom: 20,
            marginTop: 10,
            paddingHorizontal: 20
        }}>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select Port"
                listMode="SCROLLVIEW"
                style={{
                    borderColor: '#ccc',
                    backgroundColor: isDarkMode ? 'rgb(166, 108, 229)' : 'rgb(107, 64, 176)'
                }}
                dropDownContainerStyle={{
                    borderColor: '#ccc',
                    backgroundColor: isDarkMode ? 'rgb(166, 108, 229)' : 'rgb(107, 64, 176)'
                }}
                textStyle={[styles.analysisButtonText, { color: isDarkMode ? 'black' : '#fff' }]}
                arrowIconStyle={{ tintColor: isDarkMode ? 'black' : '#fff' }}
                disabledItemLabelStyle={{
                    color: 'red'
                }}
            />
        </View>
    );
}

const AnalysisScreen = ({ route, navigation }) => {
    const portId = route.params.selectedPortId;
    const [selectedPort, setSelectedPort] = useState(`port_${portId}_history`);
    const [selectedPortMax, setSelectedPortMax] = useState(`port_${portId}_max`);
    const [portData, setPortData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(1);
    const [portNames, setPortNames] = useState(null);
    const [maxValues, setMaxValues] = useState(null);

    useEffect(() => {
        const data = ref(db);
        onValue(data, (snapshot) => {
            const val = snapshot.val();
            setIsDarkMode(val.DarkMode);
            setPortNames(val.Ports);
        });
    }, []);

    const fetchData = async () => {
        try {
            const storedData = await AsyncStorage.getItem(selectedPort);
            const storedDataMax = await AsyncStorage.getItem(selectedPortMax);
            if (storedData) {
                setPortData(JSON.parse(storedData));
            }
            if (storedDataMax) {
                setMaxValues(JSON.parse(storedDataMax));
            }
        } catch (e) {
            console.log('Error loading port data:', e);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000); // update every 2 sec
        return () => clearInterval(interval);
    }, [selectedPort]);

    // Dark mode colors
    const backgroundColor = !isDarkMode ? 'rgba(0,0,0,0.69)' : 'rgba(255, 255, 255, 0.85)';
    const headerBgColor = !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
    const iconColor = !isDarkMode ? '#fff' : '#fff';

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
                            name="chart-line"
                            color="#fff"
                            size={36}
                            style={styles.headerIcon}
                        />
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.headerTitle, { color: iconColor }]}>ANALYSIS</Text>
                            <Ionicons name="chevron-forward" color="#fff" size={20} style={{ marginTop: 3 }} />
                            {portNames &&
                                <Text style={[styles.headerTitle, { color: iconColor }]}>
                                    {portNames[portId - 1]}
                                </Text>
                            }
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate('PortScreens', { portId })}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" color="#fff" size={20} style={{ marginTop: 3 }} />
                        <Text style={[styles.headerTitle, { color: iconColor }]}>PORTS</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor }}>
                    <PortSelector
                        selectedPort={portId}
                        setSelectedPort={setSelectedPort}
                        setSelectedPortMax={setSelectedPortMax}
                        isDarkMode={isDarkMode}
                    />
                </View>

                <ScrollView
                    style={[styles.scrollView, { backgroundColor }]}
                    contentContainerStyle={styles.scrollContent}
                >
                    <GraphCard
                        title="Voltage"
                        data={portData.map((d) => d.Voltage)}
                        maxValue={maxValues?.maxVoltage}
                        color="#4285F4"
                        isDarkMode={isDarkMode}
                    />
                    <GraphCard
                        title="Current"
                        data={portData.map((d) => d.Current)}
                        maxValue={maxValues?.maxCurrent}
                        color="#EA4335"
                        isDarkMode={isDarkMode}
                    />
                    <GraphCard
                        title="Power"
                        data={portData.map((d) => d.Power)}
                        maxValue={maxValues?.maxPower}
                        color="#FBBC05"
                        isDarkMode={isDarkMode}
                    />
                    <GraphCard
                        title="Power Factor"
                        data={portData.map((d) => d.PowerFactor)}
                        maxValue={maxValues?.maxPowerFactor}
                        color="#9B51E0"
                        isDarkMode={isDarkMode}
                    />
                    <GraphCard
                        title="Frequency"
                        data={portData.map((d) => d.Frequency)}
                        maxValue={maxValues?.maxFrequency}
                        color="#34A853"
                        isDarkMode={isDarkMode}
                    />
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
    headerTextContainer: {
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    analysisButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default AnalysisScreen;