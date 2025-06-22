import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, StatusBar, ScrollView, RefreshControl, ImageBackground, TouchableOpacity, Modal, TextInput, BackHandler, Alert, Platform, } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { db, ref, onValue, update } from "../Components/firebase";
import AutoCarousel from '../Components/AutoCarousel';
import FloatingButton from '../Components/FloatingButton';

const backGroundImg = require("../images/BackImg.png");
const loadingBackImg = require("../images/screen.png");

const HomeScreen = ({ navigation }) => {
    // State management
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModelVisible, setModelVisible] = useState(false);
    const [portName, setPortName] = useState("");
    const [NewPortName, setNewPortName] = useState("");
    const [portId, setPortId] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(1);
    const [conn, setConn] = useState(0);

    // Port states
    const [ports, setPorts] = useState({
        ports: ['', '', '', '', ''],
        switches: [0, 0, 0, 0, 0]
    });

    // Image slider 
    const images = [
        require('../images/scrollImage/Img1.png'),
        require('../images/scrollImage/Img2.png'),
        require('../images/scrollImage/Img3.png'),
    ];

    // Helper functions
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Data fetching and refresh
    const check = () => {
        const data = ref(db);
        update(data, { Connection: 0, Choose: 1 });

        onValue(data, (snapshot) => {
            const val = snapshot.val();
            setConn(val.Connection || 0);
            setPorts({
                ports: val.Ports || ["Port 1", "Port 2", "Port 3", "Port 4", "Port 5"],
                switches: val.Switches || [0, 0, 0, 0, 0],
            });
        });
    };

    const pullMe = async () => {
        setRefresh(true);
        check();
        await delay(1000);
        setRefresh(false);
    };

    // Effects
    useEffect(() => {
        check();
        const timeout = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Exit App', 'Are you sure you want to exit?', [
                { text: "Cancel", style: 'cancel' },
                { text: "Exit", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    // Port operations
    const renamePort = () => {
        if (!NewPortName.trim()) {
            Alert.alert('Error', 'Port name cannot be empty');
            return;
        }

        if (ports.ports.includes(NewPortName)) {
            Alert.alert('Error', 'Port name must be unique');
            return;
        }

        const updates = {};
        updates[`Ports/${portId}`] = NewPortName;
        update(ref(db), updates);
        setModelVisible(false);
    };

    const toggleSwitch = (portIndex) => {
        const newSwitches = [...ports.switches];
        newSwitches[portIndex] = newSwitches[portIndex] ? 0 : 1;

        update(ref(db), {
            Switches: newSwitches,
        });
    };

    // Navigation helpers
    const navigateToPort = (portIndex) => {
        const portId = portIndex + 1;
        navigation.navigate('PortScreens', { portId });
    };

    const openRenameModal = (portIndex) => {
        setPortName(ports.ports[portIndex]);
        setPortId(portIndex);
        setModelVisible(true);
    };

    // Dark mode selector
    useEffect(() => {
        const data = ref(db);
        onValue(data, (snapshot) => {
            const val = snapshot.val();
            setIsDarkMode(val.DarkMode);
        });
    }, []);

    const backgroundColor = !isDarkMode ? 'rgba(0,0,0,0.69)' : 'rgba(255, 255, 255, 0.85)';
    const headerBgColor = !isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(147, 51, 234)';
    const textColor = isDarkMode ? 'black' : '#fff';
    const iconColor = !isDarkMode ? '#fff' : '#fff';
    const memberContainer = !isDarkMode ? 'rgb(107, 64, 176)' : 'rgba(217, 182, 255, 0.66)';
    const logoText = !isDarkMode ? '#C4B5FD' : '#9333EA';

    // Loading screen
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={headerBgColor} barStyle={"light-content"} />
                <ImageBackground source={loadingBackImg} style={styles.loadingBackground}>
                    <View style={styles.loadingContainer}>
                        <Text style={[styles.loadingText, { color: logoText }]}>Initializing</Text>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }

    // Main render
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={headerBgColor}
                barStyle={"light-content"}
            />

            <ImageBackground
                source={backGroundImg}
                style={styles.backgroundImage}
                blurRadius={isDarkMode ? 3 : 1}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: headerBgColor }]}>
                    <View style={styles.headerContent}>
                        <Ionicons
                            name="home"
                            color={iconColor}
                            size={24}
                            style={styles.headerIcon}
                        />
                        <Text style={[styles.headerTitle, { color: iconColor }]}>
                            HOME
                        </Text>
                    </View>

                    <View style={styles.connectionStatus}>
                        <Ionicons
                            name="ellipse-sharp"
                            color={conn ? '#4CAF50' : '#F44336'}
                            size={14}
                        />
                        <Text style={[
                            styles.connectionText,
                            { color: iconColor }
                        ]}>
                            {conn ? 'Connected' : 'Disconnected'}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <ScrollView
                    style={[styles.content, { backgroundColor }]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={pullMe}
                            tintColor={isDarkMode ? "#4a90e2" : "#ffffff"}
                        />
                    }
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Image Carousel */}
                    <AutoCarousel
                        images={images}
                        interval={4000}
                        darkMode={!isDarkMode}
                    />

                    {/* Ports Section */}
                    <View style={styles.section}>
                        <View style={[
                            styles.sectionHeader,
                            { backgroundColor: memberContainer }
                        ]}>
                            <MaterialCommunityIcons
                                name="usb-port"
                                color={textColor}
                                size={24}
                            />
                            <Text style={[
                                styles.sectionTitle,
                                { color: textColor }
                            ]}>
                                PORTS
                            </Text>
                        </View>

                        {/* Port List */}
                        {ports.ports.map((port, index) => (
                            <TouchableOpacity
                                key={`port-${index}`}
                                style={[
                                    styles.portItem,
                                    { backgroundColor: memberContainer }]}
                                onPress={() => navigateToPort(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.portInfo}>
                                    <View style={styles.portNumber}>
                                        <Text style={[
                                            styles.portNumberText,
                                            { color: textColor }
                                        ]}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.portDivider,
                                        { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }
                                    ]} />
                                    <Text
                                        style={[
                                            styles.portName,
                                            { color: textColor }
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {port}
                                    </Text>
                                </View>
                                <View style={styles.portActions}>
                                    <TouchableOpacity
                                        onPress={() => openRenameModal(index)}
                                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                                    >
                                        <MaterialIcons
                                            name="edit"
                                            color={textColor}
                                            size={24}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                    <Ionicons
                                        name="chevron-forward"
                                        color={textColor}
                                        size={24}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Rename Modal */}
                        <Modal
                            visible={isModelVisible}
                            animationType="slide"
                            transparent={false}
                            onRequestClose={() => setModelVisible(false)}
                        >
                            <SafeAreaView style={[
                                styles.modalContainer,
                                { backgroundColor: isDarkMode ? 'rgb(245, 239, 255)' : 'rgba(223, 203, 255, 0.64)' }
                            ]}>
                                <View style={styles.modalHeader}>
                                    <MaterialCommunityIcons
                                        name="usb-port"
                                        color='black'
                                        size={28}
                                    />
                                    <Text style={[
                                        styles.modalTitle,
                                        { color: 'black' }
                                    ]}>
                                        Rename Port
                                    </Text>
                                    <View style={styles.modalSubtitle}>
                                        <Ionicons
                                            name="chevron-forward"
                                            color='black'
                                            size={16}
                                        />
                                        <Text style={[
                                            styles.modalSubtitleText,
                                            { color: 'black' }
                                        ]}>
                                            {portName}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.modalContent}>
                                    <Text style={[
                                        styles.modalDescription,
                                        { color: 'black' }
                                    ]}>
                                        You can change the port name as you wish. It's better to use only letters and numbers.
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                color: textColor,
                                                borderColor: isDarkMode ? 'rgb(91, 33, 182)' : 'rgb(146, 89, 237)',
                                                backgroundColor: isDarkMode ? 'rgba(133, 4, 175, 0.12)' : 'rgba(187,134,252,0.1)'
                                            }
                                        ]}
                                        placeholder={portName}
                                        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                                        onChangeText={setNewPortName}
                                        value={NewPortName}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardAppearance={isDarkMode ? 'light' : 'dark'}
                                        selectionColor={isDarkMode ? '#4a90e2' : '#BB86FC'}
                                    />

                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                styles.cancelButton,
                                                { backgroundColor: isDarkMode ? 'rgb(218, 217, 219)' : 'rgb(248, 244, 255)' }
                                            ]}
                                            onPress={() => setModelVisible(false)}
                                        >
                                            <Text style={[
                                                styles.buttonText,
                                                { color: 'black' }
                                            ]}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                styles.confirmButton,
                                                { backgroundColor: 'rgb(91, 33, 182)' }
                                            ]}
                                            onPress={renamePort}
                                        >
                                            <Text style={styles.buttonText}>
                                                Confirm
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>
                </ScrollView>

                {/* Floating Action Button */}
                <FloatingButton
                    switches={ports.switches}
                    portNames={ports.ports}
                    onSwitchToggle={toggleSwitch}
                    darkMode={isDarkMode}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

// Professional styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: '60%'
    },
    loadingText: {
        fontWeight: '600',
        fontSize: 18,
        marginTop: 16,
        color: '#4a90e2'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover'
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
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectionText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 4,
    },
    scrollContent: {
        paddingBottom: 24
    },
    section: {
        marginTop: 16,
        marginHorizontal: 16
    },
    sectionHeader: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8
    },
    sectionTitle: {
        marginLeft: 12,
        fontSize: 18,
        fontWeight: '600'
    },
    portItem: {
        height: 72,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8
    },
    portInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    portNumber: {
        width: 40,
        alignItems: 'center'
    },
    portNumberText: {
        fontSize: 18,
        fontWeight: '600'
    },
    portDivider: {
        width: 1,
        height: 24,
        marginHorizontal: 12
    },
    portName: {
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
        marginRight: 12
    },
    portActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editIcon: {
        marginRight: 20
    },
    modalContainer: {
        flex: 1
    },
    modalHeader: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginLeft: 5,
    },
    modalSubtitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 5,
    },
    modalSubtitleText: {
        fontSize: 16,
        marginLeft: 4
    },
    modalContent: {
        padding: 24
    },
    modalDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 24
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        height: 48,
        minWidth: 120,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginLeft: 16
    },
    cancelButton: {
        backgroundColor: '#F5F5F5'
    },
    confirmButton: {
        backgroundColor: '#4CAF50'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF'
    }
});

export default HomeScreen;