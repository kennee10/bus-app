import React from "react";
import { TouchableOpacity, Text, StyleSheet, Linking } from "react-native";

const PayLahComponent: React.FC = () => {
    const url = "https://www.dbs.com.sg/personal/mobile/paylink/index.html?tranRef=xEhaZBzqPd";

    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("PayLahComponent.tsx: error opening url")
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <Text>Donate via PayLah!</Text>
        </TouchableOpacity>
    )
};

export default PayLahComponent;

