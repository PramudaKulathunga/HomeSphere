import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Dimensions
} from 'react-native';
import { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import Globles from '../Components/Globles';
import Choose from '../Components/Choose';
import { db, ref, update, onValue } from "../Components/firebase";

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const backGroundImg = require("../images/PortBackImg.png")

const AnalysisScreen = ({ navigation }) => {

    const [refresh, setReafresh] = useState(false);
    const [port, setPort] = useState(0);
    const [v1, setV1] = useState(0);
    const [v2, setV2] = useState(0);
    const [v3, setV3] = useState(0);
    const [v4, setV4] = useState(0);
    const [v5, setV5] = useState(0);
    const [c1, setC1] = useState(0);
    const [c2, setC2] = useState(0);
    const [c3, setC3] = useState(0);
    const [c4, setC4] = useState(0);
    const [c5, setC5] = useState(0);
    const [f1, setF1] = useState(0);
    const [f2, setF2] = useState(0);
    const [f3, setF3] = useState(0);
    const [f4, setF4] = useState(0);
    const [f5, setF5] = useState(0);
    const [p1, setP1] = useState(0);
    const [p2, setP2] = useState(0);
    const [p3, setP3] = useState(0);
    const [p4, setP4] = useState(0);
    const [p5, setP5] = useState(0);
    const [pf1, setPf1] = useState(0);
    const [pf2, setPf2] = useState(0);
    const [pf3, setPf3] = useState(0);
    const [pf4, setPf4] = useState(0);
    const [pf5, setPf5] = useState(0);

    useEffect(() => {
        const data = ref(db);

        onValue(data, (snapshot) => {
            setPort(snapshot.val().Port);
            setV1(snapshot.val().v1);
            setV2(snapshot.val().v2);
            setV3(snapshot.val().v3);
            setV4(snapshot.val().v4);
            setV5(snapshot.val().v5);
            setC1(snapshot.val().c1);
            setC2(snapshot.val().c2);
            setC3(snapshot.val().c3);
            setC4(snapshot.val().c4);
            setC5(snapshot.val().c5);
            setP1(snapshot.val().p1);
            setP2(snapshot.val().p2);
            setP3(snapshot.val().p3);
            setP4(snapshot.val().p4);
            setP5(snapshot.val().p5);
            setF1(snapshot.val().f1);
            setF2(snapshot.val().f2);
            setF3(snapshot.val().f3);
            setF4(snapshot.val().f4);
            setF5(snapshot.val().f5);
            setPf1(snapshot.val().pf1);
            setPf2(snapshot.val().pf2);
            setPf3(snapshot.val().pf3);
            setPf4(snapshot.val().pf4);
            setPf5(snapshot.val().pf5);
        });
        Globles.maxVoltage = (v5 > Globles.maxVoltage) ? v5 : Globles.maxVoltage;
        Globles.maxCurrent = (c5 > Globles.maxCurrent) ? c5 : Globles.maxCurrent;
        Globles.maxPower = (p5 > Globles.maxPower) ? p5 : Globles.maxPower;
        Globles.maxFrequency = (f5 > Globles.maxFrequency) ? f5 : Globles.maxFrequency;
        Globles.maxPowerFactor = (pf5 > Globles.maxPowerFactor) ? pf5 : Globles.maxPowerFactor;
    }, [db]);

    {/*pull refresh*/ }
    const pullMe = () => {
        setReafresh(true)
        setTimeout(() => {
            setReafresh(false)
        }, 1000)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="lightblue" barStyle="default" />
            <ImageBackground source={backGroundImg} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >
                <View style={styles.header}>
                    <View style={styles.titleHeader}>
                        <MaterialCommunityIcons name={'usb-port'} color={'black'} size={45} style={styles.mainIcon} />
                        <Text style={styles.mainText}>ANALYSIS</Text>
                        <View style={{ flexDirection: 'row', marginTop: 27 }}>
                            <Ionicons name="caret-forward-outline" color={'black'} size={15} style={{ marginLeft: 35 }} />
                            <Text style={styles.subMainText}>{Globles.tempName}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => pullMe()}
                        />
                    }>
                    <View style={[styles.container2, { backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black' }]}>
                        <Text style={styles.graphTitle}>-- Voltage Analysis --</Text>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5"],
                                datasets: [
                                    {
                                        data: [v1, v2, v3, v4, v5]
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 20}
                            height={220}
                            yAxisSuffix="V"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "blue",
                                backgroundGradientFrom: "blue",
                                backgroundGradientTo: "blue",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 10
                            }}
                        />
                        <Text style={styles.maxTitle}>Used max Voltage = {Globles.maxVoltage} V</Text>
                    </View>
                    <View style={[styles.container2, { backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black' }]}>
                        <Text style={styles.graphTitle}>-- Current Analysis --</Text>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5"],
                                datasets: [
                                    {
                                        data: [c1, c2, c3, c4, c5]
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            yAxisSuffix="mA"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "red",
                                backgroundGradientFrom: "red",
                                backgroundGradientTo: "red",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 10
                            }}
                        />
                        <Text style={styles.maxTitle}>Used max Current = {Globles.maxCurrent} mA</Text>
                    </View>
                    <View style={[styles.container2, { backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black' }]}>
                        <Text style={styles.graphTitle}>-- Power Analysis --</Text>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5"],
                                datasets: [
                                    {
                                        data: [p1, p2, p3, p4, p5]
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            yAxisSuffix="W"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: 'rgb(255,181,9)',
                                backgroundGradientFrom: 'rgb(255,181,9)',
                                backgroundGradientTo: 'rgb(255,181,9)',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 10
                            }}
                        />
                        <Text style={styles.maxTitle}>Used max Power = {Globles.maxPower} W</Text>
                    </View>
                    <View style={[styles.container2, { backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black' }]}>
                        <Text style={styles.graphTitle}>-- Frequency Analysis --</Text>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5"],
                                datasets: [
                                    {
                                        data: [f1, f2, f3, f4, f5]
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            yAxisSuffix="Hz"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: 'rgb(20,255,55)',
                                backgroundGradientFrom: 'rgb(20,255,55)',
                                backgroundGradientTo: 'rgb(20,255,55)',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 10
                            }}
                        />
                        <Text style={styles.maxTitle}>Used max Frequency = {Globles.maxFrequency} Hz</Text>
                    </View>
                    <View style={[styles.container2, { backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black' }]}>
                        <Text style={styles.graphTitle}>-- Power Factor Analysis --</Text>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5"],
                                datasets: [
                                    {
                                        data: [pf1, pf2, pf3, pf4, pf5]
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: 'rgb(220,21,255)',
                                backgroundGradientFrom: 'rgb(220,21,255)',
                                backgroundGradientTo: 'rgb(220,21,255)',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                marginLeft: 10
                            }}
                        />
                        <Text style={styles.maxTitle}>Used max Power Factor = {Globles.maxPowerFactor}</Text>
                    </View>
                </ScrollView>

                <View style={{ backgroundColor: (Globles.tempDark == 1) ? 'white' : 'black', width: '100%', height: 100, opacity: 0.8, marginTop: 5, marginBottom: 5 }}>
                    <View style={styles.homeHeader}>
                        <TouchableOpacity
                            onPress={() => [navigation.replace('HomeScreen'), Choose(1, 0)]}
                        >
                            <View style={[styles.btn, { width: 180 }]}>
                                <MaterialCommunityIcons name="chevron-double-left" color={'black'} size={25} style={styles.arrowIcon} />
                                <Text style={[styles.mainText, styles.homeText]}>BACK TO HOME</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => [navigation.goBack('PortScreen'), Choose(2, (port))]}
                        >
                            <View style={styles.btn}>
                                <Ionicons name="chevron-back-outline" color={'black'} size={20} style={styles.arrowIcon} />
                                <Text style={[styles.mainText, styles.homeText]}>BACK</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView >
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
        marginTop: 35,
    },
    titleHeader: {
        flexDirection: 'row',
        marginLeft: 15
    },
    homeHeader: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginTop: 20
    },
    mainIcon: {
        marginTop: 14,
    },

    mainText: {
        marginTop: 17,
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
    container2: {
        width: '100%',
        height: 310,
        opacity: 0.8,
        marginTop: 5,
        marginBottom: 5,
    },
    homeText: {
        fontSize: 18,
        marginTop: 0,
        marginLeft: '3%',
    },
    btn: {
        flexDirection: 'row',
        width: 100,
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(204,254,217)'
    },
    graphTitle: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: (Globles.tempDark == 0) ? 'white' : 'black',
    },
    maxTitle: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    }
});

export default AnalysisScreen