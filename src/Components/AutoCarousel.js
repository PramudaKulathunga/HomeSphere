import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Image,
    Dimensions,
    FlatList,
    StyleSheet,
    Animated,
    TouchableOpacity
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const AutoCarousel = ({ images, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    let timer = useRef(null);

    // Auto-scroll function
    const startAutoScroll = () => {
        timer.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true
            });
        }, interval);
    };

    // Handle scroll events
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    // Handle manual scroll end
    const handleScrollEnd = (e) => {
        const contentOffset = e.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentIndex(index);
    };

    // Initialize and clean up timer
    useEffect(() => {
        startAutoScroll();
        return () => clearInterval(timer.current);
    }, [currentIndex]);

    // Reset timer on touch
    const handleTouch = () => {
        clearInterval(timer.current);
        startAutoScroll();
    };

    // Render item
    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={1} onPress={handleTouch}>
            <Image source={item} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
    );

    // Render pagination dots
    const renderDots = () => (
        <View style={styles.pagination}>
            {images.map((_, index) => {
                const opacity = scrollX.interpolate({
                    inputRange: [
                        (index - 1) * screenWidth,
                        index * screenWidth,
                        (index + 1) * screenWidth,
                    ],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.dot, { opacity }]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
            />
            {renderDots()}
        </View>
    );
};

export default AutoCarousel;

const styles = StyleSheet.create({
    container: {
        height: 300,
        marginTop: 5,
        backgroundColor: 'black',
    },
    image: {
        width: screenWidth,
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 4,
    },
});