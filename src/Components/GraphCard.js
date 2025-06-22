import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Path,
    Circle,
    Text as SvgText,
    Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const GRAPH_WIDTH = width - 30;
const GRAPH_HEIGHT = 160;

function getSmoothPath(points) {
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        path += ` Q ${p1.x},${p1.y} ${midX},${midY}`;
    }
    path += ` T ${points[points.length - 1].x},${points[points.length - 1].y}`;
    return path;
}

const GraphCard = ({ title, data = [], maxValue, color }) => {
    if (!data.length) return null;

    const maxY = Math.max(...data);
    const minY = Math.min(...data);
    const rangeY = maxY - minY || 1;

    const points = data.map((value, index) => ({
        x: (index / (data.length - 1)) * GRAPH_WIDTH * 0.9,
        y: GRAPH_HEIGHT - ((value - minY) / rangeY) * GRAPH_HEIGHT,
    }));

    const path = getSmoothPath(points);

    return (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.title, { fontSize: 16, color: color }]}>Max {title}: {maxValue.toFixed(1)}</Text>
            </View>

            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
                <Defs>
                    <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={color} stopOpacity="1" />
                        <Stop offset="1" stopColor="#B8B5FF" stopOpacity="0.7" />
                    </LinearGradient>
                </Defs>

                {/* Background */}
                <Rect width="90%" height="100%" fill="url(#gradient)" opacity={0.08} />

                {/* Grid Lines */}
                {[0, GRAPH_HEIGHT / 2, GRAPH_HEIGHT].map((y, i) => (
                    <Path
                        key={i}
                        d={`M0 ${y} H${GRAPH_WIDTH * 0.9}`}
                        stroke="#E0E0E0"
                        strokeWidth="1"
                        strokeDasharray="4"
                    />
                ))}

                {/* Curve Path */}
                <Path
                    d={path}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <Circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill={color}
                        stroke="#fff"
                        strokeWidth="1"
                    />
                ))}

                {/* Y-axis labels */}
                <SvgText x="4" y="12" fontSize="10" fill="#555">
                    {maxY.toFixed(1)}
                </SvgText>
                <SvgText x="4" y={GRAPH_HEIGHT / 2 + 4} fontSize="10" fill="#555">
                    {((maxY + minY) / 2).toFixed(1)}
                </SvgText>
                <SvgText x="4" y={GRAPH_HEIGHT - 2} fontSize="10" fill="#555">
                    {minY.toFixed(1)}
                </SvgText>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 25,
        marginHorizontal: 15,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
});

export default GraphCard