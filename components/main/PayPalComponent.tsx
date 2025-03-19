import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import { useTheme } from '../../assets/styles/ThemeContext';

const PayPalComponent: React.FC = () => {
    const { containerStyles } = useTheme();

    const url = "https://www.paypal.com/paypalme/kennee10";

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("PayPalComponent.tsx: error opening url")
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={containerStyles.button}
        >
            <Text style={containerStyles.globalTextMessage}>PayPal</Text>
        </TouchableOpacity>
    )
};

export default PayPalComponent;
