import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
    RefreshControl,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    Animated,
    BackHandler,
    Alert
} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { db, ref, onValue, update } from "../Components/firebase";
import AutoCarousel from '../Components/AutoCarousel';
import Globles from "../Components/Globles";
import Choose from "../Components/Choose";
import FloatingButton from '../Components/FloatingButton';

const backGroundImg = require("../images/BackImg.png");
const loadingBackImg = require("../images/screen.png");

const HomeScreen = ({ navigation }) => {

    const [refresh, setRefresh] = useState(false);
    const [isLoading, setISLoading] = React.useState(true);
    const [isModelVisible, setModelVisible] = useState(false);
    const [portName, setPortName] = useState("");
    const [isDark, setIsDark] = useState(1);
    const [conn, setConn] = useState(0);
    const [pop, setPop] = useState(false);

    const [port1, setPort1] = useState('');
    const [port2, setPort2] = useState('');
    const [port3, setPort3] = useState('');
    const [port4, setPort4] = useState('');
    const [port5, setPort5] = useState('');
    const [switch1, setSwitch1] = useState(0);
    const [switch2, setSwitch2] = useState(0);
    const [switch3, setSwitch3] = useState(0);
    const [switch4, setSwitch4] = useState(0);
    const [switch5, setSwitch5] = useState(0);
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );
    const [icon_1] = useState(new Animated.Value(40));
    const [icon_2] = useState(new Animated.Value(40));
    const [icon_3] = useState(new Animated.Value(40));
    const [icon_4] = useState(new Animated.Value(40));
    const [icon_5] = useState(new Animated.Value(40));

    // Image slider 
    const images = [
        require('../images/Img1.png'),
        require('../images/Img2.png'),
        require('../images/Img3.png'),
        require('../images/Img4.png'),
    ];

    {/*pull refresh*/ }
    const pullMe = async event => {
        setRefresh(true)
        check()
        await delay(1000);
        setRefresh(false)
    };

    {/*database check */ }
    const check = () => {
        const data = ref(db);
        update(data, { Connection: (0) })
        update(data, { Choose: (1) })

        onValue(data, (snapshot) => {
            setConn(snapshot.val().Connection);
            setIsDark(snapshot.val().DarkMode);
            setPort1(snapshot.val().Port1);
            setPort2(snapshot.val().Port2);
            setPort3(snapshot.val().Port3);
            setPort4(snapshot.val().Port4);
            setPort5(snapshot.val().Port5);
            setSwitch1(snapshot.val().Switch1);
            setSwitch2(snapshot.val().Switch2);
            setSwitch3(snapshot.val().Switch3);
            setSwitch4(snapshot.val().Switch4);
            setSwitch5(snapshot.val().Switch5);
        });
    }

    // Loading page Timer 
    React.useEffect(() => {
        check()
        const timeout = setTimeout(() => {
            setISLoading(false);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [db]);

    {/*Rename function for upload data to firebase*/ }
    const rename = () => {
        const data = ref(db);
        if (Globles.tempId == 1) { update(data, { Port1: portName }) }
        else if (Globles.tempId == 2) { update(data, { Port2: portName }) }
        else if (Globles.tempId == 3) { update(data, { Port3: portName }) }
        else if (Globles.tempId == 4) { update(data, { Port4: portName }) }
        else if (Globles.tempId == 5) { update(data, { Port5: portName }) }
    };

    const activeSwitches = () => {
        const data = ref(db);
        if (Globles.tempSwitchId == 1) {
            if (switch1 == 0) {
                update(data, { Switch1: 1 });
            } else if (switch1 == 1) {
                update(data, { Switch1: 0 });
            }
        }
        else if (Globles.tempSwitchId == 2) {
            if (switch2 == 0) {
                update(data, { Switch2: 1 });
            } else if (switch2 == 1) {
                update(data, { Switch2: 0 });
            }
        }
        else if (Globles.tempSwitchId == 3) {
            if (switch3 == 0) {
                update(data, { Switch3: 1 });
            } else if (switch3 == 1) {
                update(data, { Switch3: 0 });
            }
        }
        else if (Globles.tempSwitchId == 4) {
            if (switch4 == 0) {
                update(data, { Switch4: 1 });
            } else if (switch4 == 1) {
                update(data, { Switch4: 0 });
            }
        }
        else if (Globles.tempSwitchId == 5) {
            if (switch5 == 0) {
                update(data, { Switch5: 1 });
            } else if (switch5 == 1) {
                update(data, { Switch5: 0 });
            }
        }
    };

    {/*Exit message*/ }
    React.useEffect(() => {
        const BackAction = () => {
            Alert.alert('Alert!!', 'Are you sure you want to exit?', [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: 'cancel'
                },
                {
                    text: "Yes",
                    onPress: () => BackHandler.exitApp()
                }
            ]);
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            BackAction
        )
    }, []);

    {/*Loading screen*/ }
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="lightblue" barStyle="default" />
                <ImageBackground source={loadingBackImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', alignContent: 'center', height: 80, width: '100%', marginTop: '120%' }}>
                        <ActivityIndicator size={"large"} color={"blue"} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10, color: 'blue' }}>Loading</Text>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }

    {/* Home header */ }
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >

                <StatusBar backgroundColor="lightblue" barStyle="default" />
                <View style={[styles.home, { backgroundColor: (isDark == 1) ? 'rgb(151,189,253)' : 'black' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="home" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.homeIcon} />
                        <Text style={[styles.homeText, { color: (isDark == 0) ? 'white' : 'black' }]}>HOME</Text>
                    </View >
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="ellipse-sharp" color={(conn == 1) ? 'green' : 'red'} size={17} style={styles.dotIcon} />
                        <Text style={[styles.connectedText, { color: (isDark == 0) ? 'white' : 'black' }]}>{(conn == 1) ? 'Connected' : 'Disconnected'}</Text>
                    </View>
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => pullMe()}
                        />
                    }
                >

                    {/*Welcome image slider*/}
                    <AutoCarousel images={images} interval={4000} />

                    {/*Port slides*/}
                    <View>
                        <View style={[styles.home, styles.ports, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                            <MaterialCommunityIcons name="usb-port" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.homeIcon} />
                            <Text style={[styles.homeText, { color: (isDark == 0) ? 'white' : 'black' }]}>PORTS </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.port, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}
                            onPress={() => [navigation.navigate('PortScreens'), Globles.tempId = 1, Globles.tempName = port1, Globles.tempDark = isDark, Choose(2, 1)]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.port, { width: 50, backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                                    <Text style={[styles.homeText, styles.idText, { color: (isDark == 0) ? 'white' : 'black' }]}>1</Text>
                                </View>
                                <View style={{ backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'white', width: 2 }} />
                                <Text style={[styles.portName, { color: (isDark == 0) ? 'white' : 'black' }]}>{port1}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => [setModelVisible(true), Globles.tempName = port1, Globles.tempId = 1, Globles.tempDark = isDark]}
                                >
                                    <MaterialIcons name="edit" color={(isDark == 0) ? 'white' : 'black'} size={30} style={[styles.arrowIcon, styles.editIcon]} />
                                </TouchableOpacity>
                                <Ionicons name="chevron-forward-outline" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.port, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}
                            onPress={() => [navigation.navigate('PortScreens'), Globles.tempId = 2, Globles.tempName = port2, Globles.tempDark = isDark, Choose(2, 2)]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.port, { width: 50, backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                                    <Text style={[styles.homeText, styles.idText, { color: (isDark == 0) ? 'white' : 'black' }]}>2</Text>
                                </View>
                                <View style={{ backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'white', width: 2 }} />
                                <Text style={[styles.portName, { color: (isDark == 0) ? 'white' : 'black' }]}>{port2}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => [setModelVisible(true), Globles.tempName = port2, Globles.tempId = 2, Globles.tempDark = isDark]}
                                >
                                    <MaterialIcons name="edit" color={(isDark == 0) ? 'white' : 'black'} size={30} style={[styles.arrowIcon, styles.editIcon]} />
                                </TouchableOpacity>
                                <Ionicons name="chevron-forward-outline" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.port, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}
                            onPress={() => [navigation.navigate('PortScreens'), Globles.tempId = 3, Globles.tempName = port3, Globles.tempDark = isDark, Choose(2, 3)]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.port, { width: 50, backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                                    <Text style={[styles.homeText, styles.idText, { color: (isDark == 0) ? 'white' : 'black' }]}>3</Text>
                                </View>
                                <View style={{ backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'white', width: 2 }} />
                                <Text style={[styles.portName, { color: (isDark == 0) ? 'white' : 'black' }]}>{port3}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => [setModelVisible(true), Globles.tempName = port3, Globles.tempId = 3, Globles.tempDark = isDark]}
                                >
                                    <MaterialIcons name="edit" color={(isDark == 0) ? 'white' : 'black'} size={30} style={[styles.arrowIcon, styles.editIcon]} />
                                </TouchableOpacity>
                                <Ionicons name="chevron-forward-outline" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.port, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}
                            onPress={() => [navigation.navigate('PortScreens'), Globles.tempId = 4, Globles.tempName = port4, Globles.tempDark = isDark, Choose(2, 4)]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.port, { width: 50, backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                                    <Text style={[styles.homeText, styles.idText, { color: (isDark == 0) ? 'white' : 'black' }]}>4</Text>
                                </View>
                                <View style={{ backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'white', width: 2 }} />
                                <Text style={[styles.portName, { color: (isDark == 0) ? 'white' : 'black' }]}>{port4}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => [setModelVisible(true), Globles.tempName = port4, Globles.tempId = 4, Globles.tempDark = isDark]}
                                >
                                    <MaterialIcons name="edit" color={(isDark == 0) ? 'white' : 'black'} size={30} style={[styles.arrowIcon, styles.editIcon]} />
                                </TouchableOpacity>
                                <Ionicons name="chevron-forward-outline" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.port, { backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}
                            onPress={() => [navigation.navigate('PortScreens'), Globles.tempId = 5, Globles.tempName = port5, Globles.tempDark = isDark, Choose(2, 5)]}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.port, { width: 50, backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'black' }]}>
                                    <Text style={[styles.homeText, styles.idText, { color: (isDark == 0) ? 'white' : 'black' }]}>5</Text>
                                </View>
                                <View style={{ backgroundColor: (isDark == 1) ? 'rgb(204,254,217)' : 'white', width: 2 }} />
                                <Text style={[styles.portName, { color: (isDark == 0) ? 'white' : 'black' }]}>{port5}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => [setModelVisible(true), Globles.tempName = port5, Globles.tempId = 5, Globles.tempDark = isDark]}
                                >
                                    <MaterialIcons name="edit" color={(isDark == 0) ? 'white' : 'black'} size={30} style={[styles.arrowIcon, styles.editIcon]} />
                                </TouchableOpacity>
                                <Ionicons name="chevron-forward-outline" color={(isDark == 0) ? 'white' : 'black'} size={30} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>

                        {/*Rename modal*/}
                        <Modal visible={isModelVisible} animationType='fade' presentationStyle='pageSheet'>

                            <SafeAreaView style={styles.container}>
                                <StatusBar style={styles.statusbar} />
                                <View style={styles.header}>
                                    <View style={styles.titleHeader}>
                                        <MaterialCommunityIcons name={'usb-port'} color={'black'} size={35} style={styles.mainIcon} />
                                        <Text style={styles.mainText}>RENAME PORT</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Ionicons name="caret-forward-outline" color={'black'} size={15} style={{ marginTop: 18, marginLeft: 30 }} />
                                            <Text style={styles.subMainText}>{Globles.tempName}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View style={[styles.model, { backgroundColor: (isDark == 0) ? 'black' : 'white' }]}>
                                    <Text style={[styles.detailsText, { color: (isDark == 0) ? 'white' : 'black' }]}>
                                        <Text style={{ fontWeight: 'normal' }}>You can change the port name as you wish.</Text> If it's better if it has only letters and numbers.
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={Globles.tempName}
                                        placeholderTextColor={(isDark == 0) ? 'white' : 'gray'}
                                        onChangeText={setPortName}
                                        autoCapitalize='none'
                                        color={(isDark == 0) ? 'white' : 'black'}
                                        autoCorrect={false}
                                        keyboardAppearance={(isDark == 0) ? 'light' : 'dark'}
                                    />

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={styles.btn}
                                            onPress={() => setModelVisible(false)}>
                                            <Text style={styles.btntext}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 15 }} />

                                        <TouchableOpacity style={[styles.btn, { backgroundColor: 'rgb(138,254,167)', marginLeft: 8 }]}
                                            onPress={() => {

                                                if (portName.length == 0) {
                                                    Alert.alert('Port name is empty!', 'Plase fill any name or press "cansel"')
                                                }
                                                else if (portName == port1 || portName == port2 || portName == port3 || portName == port4 || portName == port5) {
                                                    Alert.alert('Port name is same as another port name!', 'Plase fill another name or press "cansel"')
                                                }
                                                else {
                                                    setModelVisible(false)
                                                    rename()
                                                }
                                            }}
                                        >
                                            <Text style={styles.btntext}>RENAME</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>

                    {/*Down slide part*/}
                    <View style={[styles.home, styles.downPart, { backgroundColor: (isDark == 1) ? 'rgb(151,189,253)' : 'black' }]}>
                        <View style={{ width: '100%', height: 5, marginBottom: (isDark == 0) ? 5 : 3, backgroundColor: (isDark == 0) ? 'white' : 'rgb(151,189,253)' }}></View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AboutUsScreen', Globles.tempDark = isDark)}
                        >
                            <Text style={[styles.downText, { color: (isDark == 0) ? 'white' : 'black' }]}>About us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('HowToUseScreen', Globles.tempDark = isDark)}
                        >
                            <Text style={[styles.downText, { color: (isDark == 0) ? 'white' : 'black' }]}>How to use Homesphere?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { navigation.navigate('SettingsScreen'), Globles.tumb = (!isDark), Globles.tempDark = isDark }}
                        >
                            <Text style={[styles.downText, { color: (isDark == 0) ? 'white' : 'black' }]}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: '40' }} />
                </ScrollView>

                {/*Floating button*/}
                <FloatingButton
                    switch1={switch1}
                    switch2={switch2}
                    switch3={switch3}
                    switch4={switch4}
                    switch5={switch5}
                    activeSwitches={activeSwitches}
                    port1={port1}
                    port2={port2}
                    port3={port3}
                    port4={port4}
                    port5={port5}
                />
            </ImageBackground>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    home: {
        height: 50,
        backgroundColor: 'rgb(151,189,253)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.9,
        marginTop: 35,
    },
    homeIcon: {
        marginLeft: 15,
        marginTop: 10,
    },
    homeText: {
        marginTop: 8,
        marginLeft: 15,
        fontWeight: 'bold',
        fontSize: 25,
        color: 'black'
    },
    dotIcon: {
        marginTop: 15
    },
    connectedText: {
        marginTop: 9,
        marginLeft: 7,
        fontWeight: 'bold',
        fontSize: 21,
        marginRight: '5%',
        color: 'black'
    },
    ports: {
        marginBottom: 5,
        justifyContent: 'flex-start',
        opacity: 0.9
    },
    port: {
        width: '100%',
        height: 100,
        backgroundColor: 'rgb(204,254,217)',
        marginBottom: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        opacity: 0.75
    },
    idText: {
        marginTop: 30,
        marginLeft: 19,
    },
    portName: {
        marginLeft: 20,
        marginTop: 33,
        fontSize: 22,
        maxHeight: 'auto',
    },
    arrowIcon: {
        marginTop: 37,
        marginRight: 20,
    },
    editIcon: {
        marginRight: 30,
    },
    model: {
        width: '100%',
        height: '100%',
        opacity: 0.9
    },
    detailsText: {
        marginTop: 20,
        marginRight: '5%',
        marginLeft: '5%',
        fontSize: 19,
        fontWeight: 'bold',
        color: 'black'
    },
    input: {
        borderWidth: 2,
        borderColor: 'rgb(204,254,217)',
        borderRadius: 3,
        height: 50,
        width: '70%',
        fontSize: 18,
        textAlignVertical: 'center',
        paddingLeft: 15,
        shadowRadius: 5,
        textAlign: 'left',
        marginBottom: 13,
        marginTop: 13,
        marginLeft: '5%'
    },
    btn: {
        width: 120,
        height: 45,
        backgroundColor: 'rgb(255,149,152)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        shadowColor: 'gray',
        marginLeft: '5%'
    },
    btntext: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 17

    },
    header: {
        height: 50,
        backgroundColor: 'rgb(204,254,217)',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleHeader: {
        flexDirection: 'row',
        marginLeft: 15
    },
    mainIcon: {
        marginTop: 10,
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
        marginTop: 14,
        fontSize: 18,
        color: 'black'
    },

    downPart: {
        marginTop: 15,
        height: 120,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        opacity: 0.9
    },
    downText: {
        marginTop: 5,
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    circle: {
        backgroundColor: 'blue',
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 100,
        right: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
    }
});

export default HomeScreen;
