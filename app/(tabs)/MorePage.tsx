import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking, Image, ScrollView } from "react-native";
import { WebView } from "react-native-webview"; // Make sure to install: expo install react-native-webview
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { scale } from "react-native-size-matters";
import { colors, containerStyles, font } from "@/assets/styles/GlobalStyles";
import PayPalComponent from "@/components/main/PayPalComponent";
import paynowQR from "../../assets/images/paynow.jpg";

// Instead of importing as a module, use require so we can use Asset.fromModule
const MRTMap = require("../../assets/images/MRTMap.svg");
import DonationTicker from '@/components/main/DonationTicker'; // Make sure to create this file

export default function App() {
  const [isPayNowVisible, setIsPayNowVisible] = useState(false);
  const [isMRTMapVisible, setIsMRTMapVisible] = useState(false);
  const [svgHtml, setSvgHtml] = useState<string | null>(null);

  // On mount, download and read the SVG file as a string,
  // then wrap it in an HTML document so the WebView can display it.
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const asset = Asset.fromModule(MRTMap);
        await asset.downloadAsync();
        if (asset.localUri) {
          const svgContent = await FileSystem.readAsStringAsync(asset.localUri);
          // Wrap the SVG content in a basic HTML document with a viewport meta tag for scaling
          const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=0.95, user-scalable=yes" />
                <style>body { margin: 0; padding: 0; background-color: white; }</style>
              </head>
              <body>
                ${svgContent}
              </body>
            </html>
          `;
          setSvgHtml(html);
        }
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    loadSvg();
  }, []);

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
    <ScrollView style={{backgroundColor: colors.background}}>
      <View style={[containerStyles.pageContainer, { justifyContent: "flex-start", paddingTop: scale(15) }]}>
      {/* Contact Me */}
      <View style={styles.oneContainer}>
        <Text style={styles.heading}>Contact Me</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={onEmailPress}>
            <MaterialCommunityIcons
              name="email"
              color={colors.onSurfaceSecondary}
              size={scale(23)}
              style={{ marginLeft: scale(5) }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Donate */}
      <View style={styles.oneContainer}>
        <Text style={styles.heading}>Donate</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={onPayNowPress} style={containerStyles.button}>
            <Text style={containerStyles.globalTextMessage}>PayNow</Text>
          </TouchableOpacity>
          <PayPalComponent />
        </View>
        <DonationTicker/>
      </View>

      {/* MRT Map */}
      <View style={styles.oneContainer}>
        <Text style={styles.heading}>MRT Map</Text>
        <View style={styles.content}>
          <TouchableOpacity onPress={onMRTMapPress} style={containerStyles.button}>
            <Text style={containerStyles.globalTextMessage}>View MRT Map</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* PayNow Modal */}
      <Modal
        visible={isPayNowVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPayNowVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}></Text>
              <TouchableOpacity onPress={() => setIsPayNowVisible(false)}>
                <Ionicons name="close-circle" style={styles.modalCrossIcon} />
              </TouchableOpacity>
            </View>
            <Image source={paynowQR} style={styles.image} />
            <Text style={[containerStyles.globalTextMessage, { padding: scale(10) }]}>
              Screenshot and Scan this QR code in your preferred Bank app
            </Text>
          </View>
        </View>
      </Modal>

      {/* MRT Map Modal via WebView */}
      <Modal
        visible={isMRTMapVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMRTMapVisible(false)}
      >
        <View style={styles.modalOverlayMRT}>
          <TouchableOpacity onPress={() => setIsMRTMapVisible(false)} style={styles.closeButton}>
            <Ionicons name="close-circle" style={styles.MRTmodalCrossIcon} />
          </TouchableOpacity>
          {svgHtml ? (
            <WebView
              source={{ html: svgHtml }}
              style={{ flex: 1, width: "100%" }}
              scalesPageToFit={true}
            />
          ) : (
            <Text style={containerStyles.globalTextMessage}>Loading SVG...</Text>
          )}
        </View>
      </Modal>
    </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: scale(14),
    fontFamily: font.bold,
    color: colors.onSurface,
    textAlign: "left",
  },
  image: {
    width: scale(180),
    height: scale(180),
    marginBottom: scale(20)
  },
  oneContainer: {
    padding: scale(12),
    borderRadius: scale(4),
    backgroundColor: colors.surface,
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    margin: scale(7.5),
    width: "95%",
  },
  content: {
    flexDirection: "row",
    marginTop: scale(10),
  },
  modalOverlayMRT: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
    paddingBottom: scale(100),
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignSelf: "center",
    marginTop: "20%",
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
    color: colors.primary,
  },
  closeButton: {
    position: "absolute",
    top: scale(40),
    right: scale(8),
    zIndex: 1,
  },
});
