import { containerStyles } from "@/assets/styles/GlobalStyles";
import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";

const PayNowLinkComponent: React.FC = () => {
    const url = "https://cobalt-odometer-e5a.notion.site/PayNow-QR-1b1411fcc67b80448a97f160385ebd3b";

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
            <Text style={containerStyles.globalTextMessage}>PayNow Link</Text>
        </TouchableOpacity>
    )
};

export default PayNowLinkComponent;
