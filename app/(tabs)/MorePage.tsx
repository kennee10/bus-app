import React, { useState } from "react";
import { View , Text, Image, StyleSheet, TouchableOpacity, Modal, Linking} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, containerStyles, font } from "@/assets/styles/GlobalStyles";
import PayLahComponent from "../../components/main/PayLahComponent";
import PayPalComponent from "@/components/main/PayPalComponent";
import { scale } from "react-native-size-matters";
import paynowQR from "../../assets/images/paynow.jpg"
import Ionicons from "react-native-vector-icons/Ionicons";


const App = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onPayPalPress = () => {
    setIsVisible(true);
  }

  const onEmailPress = () => {
    const email = "kennee100@gmail.com";
    const subject = "Your Subject Here"; // Optional
    const body = "Your email body content here"; // Optional
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch((err) =>
      console.error("Failed to open email client:", err)
    );
  };

  return (
    <View style={containerStyles.pageContainer}>
      <View style={[styles.oneContainer]}>
        <Text style={styles.heading}>Contact Me</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => onEmailPress()}>
            <MaterialCommunityIcons name="email" color={colors.onSurfaceSecondary} size={scale(23)} style={{marginLeft: scale(5)}}/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.oneContainer]}>
        <Text style={styles.heading}>Donate</Text>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={onPayPalPress}
            style={containerStyles.button}>
              <Text style={containerStyles.globalTextMessage}>PayNow</Text>
          </TouchableOpacity>
          <PayLahComponent />
          <PayPalComponent />
        </View>
          
      </View>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}></Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close-circle" style={styles.modalCrossIcon}/>
              </TouchableOpacity>
              
            </View>

            <Image source={paynowQR} style={styles.image} />
            <Text style={[containerStyles.globalTextMessage, {padding: scale(10)}]}>Screenshot and Scan this QR code in your preferred Bank app</Text>
          </View>
          
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: scale(14),
    fontFamily: font.bold,
    color: colors.onSurface,
    textAlign: "left",
  },
  oneContainer: {
    padding: scale(12),
    borderRadius: scale(4),
    backgroundColor: colors.surface,
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    margin: scale(10),
    width: "90%"
  },

  content: {
    flexDirection: "row",
    marginTop: scale(10)
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "75%",
    backgroundColor: colors.surface,
    borderRadius: scale(6),
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    padding: scale(4),
    opacity: 0.97,
    alignItems: "center",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  modalHeaderText: {
    flex: 1,
  },
  modalCrossIcon: {
    fontSize: scale(25),
    color: colors.secondary2,
    paddingTop: scale(5),
    paddingRight: scale(5),
    paddingBottom: scale(5),
  },
  
  
  image: {
    width: 200,
    height: 200,
    marginBottom: scale(20)
  },
});

export default App;
