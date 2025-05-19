import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    Platform
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Speech from 'expo-speech';
import Globles from './Globles';

const FloatingButton = ({
    switch1, switch2, switch3, switch4, switch5,
    activeSwitches, port1, port2, port3, port4, port5
}) => {
    const [pop, setPop] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = pop ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true
        }).start();

        setPop(!pop);
    };

    const handleButtonPress = async (portNumber, portName, isActive) => {
        Globles.tempSwitchId = portNumber;
        activeSwitches();

        // Using Expo Speech instead of TTS
        Speech.speak(`${portName} light is ${isActive ? 'off' : 'on'}`, {
            language: 'en', 
            rate: 1.5,      
        });
    };

    const rotation = {
        transform: [{
            rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '20deg']
            })
        }]
    };

    // Transform styles
    const subButtonStyle1 = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80]
                })
            }
        ],
        opacity: animation
    };

    const subButtonStyle2 = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60]
                })
            },
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60]
                })
            }
        ],
        opacity: animation
    };

    const subButtonStyle3 = {
        transform: [
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80]
                })
            }
        ],
        opacity: animation
    };

    const subButtonStyle4 = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60]
                })
            },
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60]
                })
            }
        ],
        opacity: animation
    };

    const subButtonStyle5 = {
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 80]
                })
            }
        ],
        opacity: animation
    };

    return (
        <View style={styles.floatingContainer}>
            {/* Sub Button 1 */}
            <Animated.View style={[styles.subButton, subButtonStyle1, { backgroundColor: switch1 ? 'red' : 'blue' }]}>
                <TouchableOpacity
                    onPress={() => handleButtonPress(1, port1, switch1)}
                >
                    <Text style={styles.buttonText}>1</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sub Button 2 */}
            <Animated.View style={[styles.subButton, subButtonStyle2, { backgroundColor: switch2 ? 'red' : 'blue' }]}>
                <TouchableOpacity
                    onPress={() => handleButtonPress(2, port2, switch2)}
                >
                    <Text style={styles.buttonText}>2</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sub Button 3 */}
            <Animated.View style={[styles.subButton, subButtonStyle3, { backgroundColor: switch3 ? 'red' : 'blue' }]}>
                <TouchableOpacity
                    onPress={() => handleButtonPress(3, port3, switch3)}
                >
                    <Text style={styles.buttonText}>3</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sub Button 4 */}
            <Animated.View style={[styles.subButton, subButtonStyle4, { backgroundColor: switch4 ? 'red' : 'blue' }]}>
                <TouchableOpacity
                    onPress={() => handleButtonPress(4, port4, switch4)}
                >
                    <Text style={styles.buttonText}>4</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sub Button 5 */}
            <Animated.View style={[styles.subButton, subButtonStyle5, { backgroundColor: switch5 ? 'red' : 'blue' }]}>
                <TouchableOpacity
                    onPress={() => handleButtonPress(5, port5, switch5)}
                >
                    <Text style={styles.buttonText}>5</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Main Button */}
            <TouchableOpacity
                style={styles.mainButton}
                onPress={toggleMenu}
            >
                <Animated.View style={rotation}>
                    <FontAwesome5 name="lightbulb" size={25} color="#FFFF" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        bottom: 130,
        right: 30,
        zIndex: 999
    },
    mainButton: {
        backgroundColor: 'blue',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    subButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        right: 5,
        bottom: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default FloatingButton;