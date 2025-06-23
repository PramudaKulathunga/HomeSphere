import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Animated
} from "react-native";

const { width, height } = Dimensions.get('window');
const COLORS = { white: '#fff', primary: 'rgb(91, 33, 182)' };

const slides = [
    {
        id: '1',
        image: require('../images/power.jpg'),
        title: 'Check the power connection',
        subtitle: 'Ensure a Steady Flow of Energy to Empower Your ESP32 Board',
    },
    {
        id: '2',
        image: require('../images/wifi.jpg'),
        title: 'Check the wifi connection',
        subtitle: 'Seamless Wifi Connectivity for Enhanced Communication Between Your ESP32 and the App',
    },
    {
        id: '3',
        image: require('../images/about.jpg'),
        title: 'Services from Homesphere',
        subtitle: 'Explore Voltage, Current, Power Consumption, Frequency and Power Factor for Optimal Control',
    },
];

const Slide = ({ item }) => {
    return (
        <View style={styles.slideContainer}>
            <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
        </View>
    );
};

const OnboardingScreen = ({ navigation }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const timerRef = useRef(null);

    const goToSlide = (index) => {
        slidesRef.current?.scrollToOffset({ offset: index * width });
        setCurrentSlideIndex(index);
    };

    const goNextSlide = () => {
        const nextIndex = currentSlideIndex + 1;
        if (nextIndex < slides.length) {
            goToSlide(nextIndex);
        }
    };

    const skipSlide = () => {
        goToSlide(slides.length - 1);
    };

    const Footer = () => {
        return (
            <View style={styles.footer}>
                {/* Pagination indicators */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 25, 10],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.indicator,
                                    {
                                        width: dotWidth,
                                        opacity,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Navigation buttons */}
                <View style={styles.buttonContainer}>
                    {currentSlideIndex === slides.length - 1 ? (
                        <TouchableOpacity
                            style={[styles.button, styles.getStartedButton]}
                            onPress={() => navigation.replace('MainTabs')}
                        >
                            <Text style={styles.buttonText}>GET STARTED</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.navigationButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.skipButton]}
                                onPress={skipSlide}
                            >
                                <Text style={styles.buttonText}>SKIP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.nextButton]}
                                onPress={goNextSlide}
                            >
                                <Text style={[styles.buttonText, styles.nextButtonText]}>NEXT</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} />
            <Animated.FlatList
                ref={slidesRef}
                data={slides}
                renderItem={({ item }) => <Slide item={item} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const contentOffsetX = e.nativeEvent.contentOffset.x;
                    const index = Math.round(contentOffsetX / width);
                    setCurrentSlideIndex(index);
                }}
                keyExtractor={(item) => item.id}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />
            <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    slideContainer: {
        width,
        height: height * 0.75,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: '80%',
        height: '60%',
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    title: {
        color: 'rgb(91, 33, 182)',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgb(166, 127, 230)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 23,
    },
    footer: {
        height: height * 0.25,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    indicator: {
        height: 2.5,
        backgroundColor: 'rgb(91, 33, 182)',
        marginHorizontal: 3,
        borderRadius: 2,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: COLORS.white,
    },
    skipButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    nextButton: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 2,
        marginLeft: 15,
    },
    nextButtonText: {
        color: COLORS.primary,
    },
    getStartedButton: {
        backgroundColor: COLORS.primary,
    },
});

export default OnboardingScreen;