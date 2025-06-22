import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Speech from 'expo-speech';
import { db, ref, onValue } from "../Components/firebase";

const FloatingButton = ({ switches, portNames, onSwitchToggle, darkMode }) => {
    const [pop, setPop] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [backdropOpacity] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = pop ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true
        }).start();
        Animated.timing(backdropOpacity, {
            toValue,
            duration: 1000,
            useNativeDriver: true
        }).start();

        setPop(!pop);
    };

    const handleButtonPress = async (portIndex, portName, isActive) => {
        onSwitchToggle(portIndex);
        toggleMenu();

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

    // Color scheme based on dark mode
    const activeColor = !darkMode ? 'rgb(176, 115, 250)' : 'rgb(46, 23, 79)';
    const inactiveColor = !darkMode ? 'rgba(199, 167, 239, 0.8)' : 'rgba(98, 0, 238, 0.5)';
    const mainButtonColor = !darkMode ? 'rgb(253, 253, 253)' : 'rgb(98, 0, 238)';
    const textColor = darkMode ? '#fff' : '#000';

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
        <>
            {pop &&
                <Animated.View
                    style={{
                        position: 'absolute',
                        backgroundColor: !darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
                        width: '100%',
                        height: '100%',
                        opacity: backdropOpacity,
                    }}
                />
            }

            <View style={styles.floatingContainer}>
                {/* Sub Button 1 */}
                <Animated.View style={[styles.subButton, subButtonStyle1, { backgroundColor: switches[0] ? activeColor : inactiveColor }]}>
                    <TouchableOpacity
                        onPress={() => handleButtonPress(0, portNames[0], switches[0])}
                        style={styles.subButtonTouchable}
                    >
                        <Text style={styles.buttonText}>1</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sub Button 2 */}
                <Animated.View style={[styles.subButton, subButtonStyle2, { backgroundColor: switches[1] ? activeColor : inactiveColor }]}>
                    <TouchableOpacity
                        onPress={() => handleButtonPress(1, portNames[1], switches[1])}
                        style={styles.subButtonTouchable}
                    >
                        <Text style={styles.buttonText}>2</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sub Button 3 */}
                <Animated.View style={[styles.subButton, subButtonStyle3, { backgroundColor: switches[2] ? activeColor : inactiveColor }]}>
                    <TouchableOpacity
                        onPress={() => handleButtonPress(2, portNames[2], switches[2])}
                        style={styles.subButtonTouchable}
                    >
                        <Text style={styles.buttonText}>3</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sub Button 4 */}
                <Animated.View style={[styles.subButton, subButtonStyle4, { backgroundColor: switches[3] ? activeColor : inactiveColor }]}>
                    <TouchableOpacity
                        onPress={() => handleButtonPress(3, portNames[3], switches[3])}
                        style={styles.subButtonTouchable}
                    >
                        <Text style={styles.buttonText}>4</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sub Button 5 */}
                <Animated.View style={[styles.subButton, subButtonStyle5, { backgroundColor: switches[4] ? activeColor : inactiveColor }]}>
                    <TouchableOpacity
                        onPress={() => handleButtonPress(4, portNames[4], switches[4])}
                        style={styles.subButtonTouchable}
                    >
                        <Text style={styles.buttonText}>5</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Button */}
                <TouchableOpacity
                    style={[styles.mainButton, { backgroundColor: mainButtonColor }]}
                    onPress={toggleMenu}
                >
                    <Animated.View style={rotation}>
                        <FontAwesome5 name="lightbulb" size={25} color={textColor} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        bottom: 85,
        right: 30,
        zIndex: 1001,
    },
    mainButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 1001
    },
    subButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        zIndex: 1001
    },
    subButtonTouchable: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default FloatingButton;