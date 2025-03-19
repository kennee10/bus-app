import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import { useTheme } from '../../assets/styles/ThemeContext';

const PayLahComponent: React.FC = () => {
    const { colors, font, containerStyles } = useTheme();
    
    const url = "https://www.dbs.com.sg/personal/mobile/paylink/index.html?tranRef=xEhaZBzqPd"; // 5th jan 2025

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("PayLahComponent.tsx: error opening url")
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={containerStyles.button}
        >
            <Text style={containerStyles.globalTextMessage}>PayLah</Text>
        </TouchableOpacity>
    )
};

export default PayLahComponent;
