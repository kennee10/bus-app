import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking, Image, ScrollView, TouchableWithoutFeedback, Platform } from "react-native";
import { WebView } from "react-native-webview"; // Make sure to install: expo install react-native-webview
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { scale } from "react-native-size-matters";
import { colors, containerStyles, font } from "@/assets/styles/GlobalStyles";
import PayPalComponent from "@/components/main/PayPalComponent";
import paynowQR from "../../assets/images/paynow.jpg";
import { SafeAreaView } from 'react-native-safe-area-context';

// Instead of importing as a module, use require so we can use Asset.fromModule
const MRTMap = require("../../assets/images/MRTMap.svg");
import DonationTicker from '@/components/main/DonationTicker'; // Make sure to create this file
import PayNowLinkComponent from "@/components/main/PayNowLinkComponent";

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
                <style>
                  body { margin: 0; padding: 0; background-color: white; }
                  svg { width: 100vw; height: auto; }
                </style>
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
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{backgroundColor: colors.background}}>
        <View style={[containerStyles.pageContainer, { justifyContent: "flex-start", paddingTop: 15 }]}>
        {/* Contact Me */}
        <View style={styles.oneContainer}>
          <Text style={styles.heading}>Contact Me</Text>
          <View style={styles.content}>
            <TouchableOpacity onPress={onEmailPress}>
              <MaterialCommunityIcons
                name="email"
                color={colors.onSurfaceSecondary}
                size={23}
                style={{ marginLeft: 5 }}
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
            {/* <PayNowLinkComponent /> */}
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
            <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
              {/* Backdrop that closes the modal */}
              <TouchableWithoutFeedback onPress={() => setIsPayNowVisible(false)}>
                <View style={StyleSheet.absoluteFillObject} />
              </TouchableWithoutFeedback>
                <View style={styles.bottomModalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>PayNow QR</Text>
                    <TouchableOpacity onPress={() => setIsPayNowVisible(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalDivider} />
                  <View style={styles.payNowImageContainer}>
                    <Image source={paynowQR} style={styles.image} />
                    <Text style={[containerStyles.globalTextMessage, { padding: 10 }]}>
                      Screenshot and Scan this QR code in your preferred Bank app
                    </Text>
                  </View>
                </View>
            </SafeAreaView>
        </Modal>

        {/* MRT Map Modal via WebView */}
        <Modal
          visible={isMRTMapVisible}
          animationType="fade"
          onRequestClose={() => setIsMRTMapVisible(false)}
        >
          <View style={styles.modalOverlayMRT}>
            <View style={[styles.bottomModalContainer, styles.mrtMapModalContainer , {padding: 0}]}>
              <View style={[styles.modalHeader, {paddingTop: 10, paddingHorizontal: 10}]}>
                <Text style={styles.modalTitle}>MRT Map</Text>
                <TouchableOpacity onPress={() => setIsMRTMapVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
                </TouchableOpacity>
              </View>
              <View style={styles.webViewContainer}>
                {svgHtml ? (
                  <WebView
                    source={{ html: svgHtml }}
                    style={{ flex: 1, width: "100%"}}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                ) : (
                  <Text style={containerStyles.globalTextMessage}>Loading SVG...</Text>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.onSurface,
    textAlign: "left",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 10
  },
  oneContainer: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderToPress2,
    margin: 7.5,
    width: "95%",
  },
  content: {
    flexDirection: "row",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlayBackgroundColor,
    justifyContent: "flex-end", // Position at bottom
  },
  modalOverlayMRT: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end", // Position at bottom
  },
  bottomModalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
    elevation: 5,
    // paddingTop: Platform.OS === 'ios' ? 20) : 0

  },
  mrtMapModalContainer: {
    // flex: 1,
    height: Platform.OS === "android" ? "100%" : "95%", // Increased height for better map viewing
    // paddingBottom: 0, // Remove bottom padding to maximize space
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
    marginTop: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: font.bold,
    color: colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.borderToPress,
    marginVertical: 10,
  },
  payNowImageContainer: {
    alignItems: "center",
    padding: 10,
  },
});
