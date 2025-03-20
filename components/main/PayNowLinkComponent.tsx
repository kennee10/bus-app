import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import { useTheme } from '../../assets/styles/ThemeContext';

const PayNowLinkComponent: React.FC = () => {
    const { containerStyles } = useTheme();

    const url = "https://cobalt-odometer-e5a.notion.site/Support-Us-1b1411fcc67b80448a97f160385ebd3b?pvs=4";

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("PayNowLinkComponent.tsx: error opening url")
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={containerStyles.button}
        >
            <Text style={containerStyles.globalTextMessage}>Details</Text>
        </TouchableOpacity>
    )
};

export default PayNowLinkComponent;
