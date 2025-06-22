import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear port data when inactive
const clearPortData = async (portId) => {
    try {
        const historyKey = `port_${portId}_history`;
        const maxKey = `port_${portId}_max`;

        await Promise.all([
            AsyncStorage.setItem(historyKey, JSON.stringify([])),
            AsyncStorage.setItem(maxKey, JSON.stringify([]))
        ]);
    } catch (error) {
        console.error(`Error clearing port ${portId} data:`, error);
    }
};

// Save port data when active
const saveLatestPortData = async (portId, newData) => {
    try {
        const historyKey = `port_${portId}_history`;
        const maxKey = `port_${portId}_max`;

        // Get existing data
        const [oldRawHistory, oldRawMax] = await Promise.all([
            AsyncStorage.getItem(historyKey),
            AsyncStorage.getItem(maxKey)
        ]);

        let historyArray = oldRawHistory ? JSON.parse(oldRawHistory) : [];
        let maxValues = oldRawMax ? JSON.parse(oldRawMax) : {
            maxVoltage: 0,
            maxCurrent: 0,
            maxPower: 0,
            maxFrequency: 0,
            maxPowerFactor: 0
        };

        // Keep only the last 9 and add the new one
        historyArray.push(newData);
        if (historyArray.length > 10) historyArray.shift();

        // Update max values
        maxValues = {
            maxVoltage: Math.max(maxValues.maxVoltage, newData.Voltage || 0),
            maxCurrent: Math.max(maxValues.maxCurrent, newData.Current || 0),
            maxPower: Math.max(maxValues.maxPower, newData.Power || 0),
            maxFrequency: Math.max(maxValues.maxFrequency, newData.Frequency || 0),
            maxPowerFactor: Math.max(maxValues.maxPowerFactor, newData.PowerFactor || 0)
        };

        // Save both
        await Promise.all([
            AsyncStorage.setItem(historyKey, JSON.stringify(historyArray)),
            AsyncStorage.setItem(maxKey, JSON.stringify(maxValues))
        ]);
    } catch (error) {
        console.error(`Error saving port ${portId} data:`, error);
    }
};

// Start listening to all 5 ports and switches
export const listenToAllPorts = () => {
    // Listen to switches
    const switchesRef = ref(db, 'Switches');
    onValue(switchesRef, (snapshot) => {
        const switches = snapshot.val() || {};

        // Check each port's switch status
        for (let portId = 1; portId <= 5; portId++) {
            if (switches[portId - 1] === 0) { // Switch is off
                clearPortData(portId);
            }
        }
    });

    // Listen to port data
    for (let portId = 1; portId <= 5; portId++) {
        const portRef = ref(db, `${portId}`);
        onValue(portRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            // Check if this port is active
            const switchesRef = ref(db, 'Switches');
            onValue(switchesRef, (switchSnapshot) => {
                const switches = switchSnapshot.val() || {};
                if (switches[portId - 1] === 1) { // Switch is on
                    saveLatestPortData(portId, data);
                }
            });
        });
    }
};

// Helper function to get switch status for a port
export const getPortSwitchStatus = async (portId) => {
    try {
        const switchesRef = ref(db, 'Switches');
        const snapshot = await get(switchesRef);
        return snapshot.val()[portId - 1] === 1;
    } catch (error) {
        console.error('Error getting switch status:', error);
        return false;
    }
};