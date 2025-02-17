import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Linking, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageViewer from 'react-native-image-zoom-viewer';
import { colors, containerStyles, font } from "@/assets/styles/GlobalStyles";
import PayLahComponent from "../../components/main/PayLahComponent";
import PayPalComponent from "@/components/main/PayPalComponent";
import { scale } from "react-native-size-matters";
import paynowQR from "../../assets/images/paynow.jpg";
import MRTMap from "../../assets/images/MRTMap.jpg";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const [isPayNowVisible, setIsPayNowVisible] = useState(false);
  const [isMRTMapVisible, setIsMRTMapVisible] = useState(false);

  const onPayNowPress = () => {
    setIsPayNowVisible(true);
  };

  const onMRTMapPress = () => {
    setIsMRTMapVisible(true);
  };

  const onEmailPress = () => {
    const email = "cheongcodes@gmail.com";
    const subject = "Your Subject Here"; // Optional
    const body = "Your email body content here"; // Optional
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch((err) =>
      console.error("Failed to open email client:", err)
    );
  };

  return (
    <View style={[containerStyles.pageContainer, { justifyContent: "flex-start", paddingTop: scale(15) }]}>
      <View style={[styles.oneContainer]}>
        <Text style={styles.heading}>Contact Me</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => onEmailPress()}>
            <MaterialCommunityIcons name="email" color={colors.onSurfaceSecondary} size={scale(23)} style={{ marginLeft: scale(5) }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.oneContainer]}>
        <Text style={styles.heading}>Donate</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={onPayNowPress} style={containerStyles.button}>
            <Text style={containerStyles.globalTextMessage}>PayNow</Text>
          </TouchableOpacity>
          {/* <PayLahComponent /> */}
          <PayPalComponent />
        </View>
      </View>

      <View style={[styles.oneContainer]}>
        <Text style={styles.heading}>MRT Map</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={onMRTMapPress} style={containerStyles.button}>
            <Text style={containerStyles.globalTextMessage}>View MRT Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isPayNowVisible} transparent={true} animationType="fade" onRequestClose={() => setIsPayNowVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}></Text>
              <TouchableOpacity onPress={() => setIsPayNowVisible(false)}>
                <Ionicons name="close-circle" style={styles.modalCrossIcon} />
              </TouchableOpacity>
            </View>
            <Image source={paynowQR} style={styles.image} />
            <Text style={[containerStyles.globalTextMessage, { padding: scale(10) }]}>Screenshot and Scan this QR code in your preferred Bank app</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={isMRTMapVisible} transparent={true} animationType="fade" onRequestClose={() => setIsMRTMapVisible(false)}>
        <ImageViewer
          imageUrls={[{ url: '', props: { source: MRTMap } }]}
          enableSwipeDown={true}
          onSwipeDown={() => setIsMRTMapVisible(false)}
          enableImageZoom={true}
          enablePreload={true}
          saveToLocalByLongPress={false}
          renderHeader={() => (
            <TouchableOpacity onPress={() => setIsMRTMapVisible(false)} style={styles.closeButton}>
              <Ionicons name="close-circle" style={styles.MRTmodalCrossIcon} />
            </TouchableOpacity>
          )}
        />
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
    margin: scale(7.5),
    width: "95%"
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
  MRTmodalCrossIcon: {
    fontSize: scale(35),
    color: colors.secondary2,
    paddingTop: scale(5),
    paddingRight: scale(5),
    paddingBottom: scale(5),
  },
  image: {
    width: scale(180),
    height: scale(180),
    marginBottom: scale(20)
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default App;