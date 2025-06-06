import React from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../assets/styles/ThemeContext';


interface BusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<BusModalProps> = ({ isVisible, onClose }) => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    infoContainer: {
      flexDirection: "column",
      gap: 12.5,
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    oneInfoContainer: {
      flexDirection: "column",
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderToPress2,
      paddingBottom: 12.5,
    },
    oneLine: {
      flexDirection: "row",
    },
    leftSide: {
      flex: 2,
    },
    rightSide: {
      flex: 6,
      marginRight: 27,
    },
    infoText: {
      fontSize: 12,
      fontFamily: font.bold,
      color: colors.onSurface,
      textAlign: "justify",
    },
    proTipText: {
      fontSize: 11,
      fontFamily: font.medium,
      color: colors.onSurfaceSecondary,
      textAlign: "justify",
      marginTop: 2,
    },
    timingWrapper: {
      width: 50,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 3,
    },
    minsWrapper: {
      justifyContent: 'flex-end',
    },
    mins: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.onSurface2Secondary,
    },
    secsWrapper: {
      justifyContent: 'flex-end',
      marginLeft: 2,
    },
    secs: {
      fontSize: 6.5,
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.onSurface2Secondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlayBackgroundColor,
      justifyContent: "flex-end",
    },
    bottomModalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 10,
      elevation: 5,
      maxHeight: "80%",
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
    scrollContainer: {
      flexGrow: 1,
    },
  });


  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
        <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
            <View style={styles.bottomModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Info</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalDivider} />

              {/* Wrap the content with ScrollView */}
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.infoContainer}>

                  {/* Timings */}
                  <View style={styles.oneInfoContainer}>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={styles.timingWrapper}>
                          <View style={styles.minsWrapper}>
                            <Text
                              style={styles.mins}
                              adjustsFontSizeToFit
                              numberOfLines={1}
                            >
                              8
                            </Text>
                          </View>
                          <View style={styles.secsWrapper}>
                            <Text
                              style={styles.secs}
                              adjustsFontSizeToFit
                              numberOfLines={1}
                            >
                              26
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>
                          Arrival time in mins & secs. Refreshes every 3 secs
                        </Text>
                        <Text style={styles.proTipText}>
                          Not always accurate, arrive 1-2 mins early
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Last Updated */}
                  <View style={styles.oneInfoContainer}>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{
                            width: 3,
                            height: 12,
                            borderRadius: 5,
                            backgroundColor: colors.accent,
                            position: 'absolute',
                            top: 4
                          }} />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>
                          Live Location Updated {'<'} 15 seconds ago
                        </Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{
                            width: 3,
                            height: 12,
                            borderRadius: 5,
                            backgroundColor: colors.warning,
                            position: 'absolute',
                            top: 4
                          }} />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>
                          Live Location Updated 15 - 45 seconds ago
                        </Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{
                            width: 3,
                            height: 12,
                            borderRadius: 5,
                            backgroundColor: colors.error,
                            position: 'absolute',
                            top: 4
                          }} />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>
                          Last Update {'>'} 45 seconds ago
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Monitored */}
                  <View style={styles.oneInfoContainer}>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <MaterialCommunityIcons
                          name="clock-alert"
                          color={colors.accent7}
                          size={14}
                          style={{ position: 'absolute', top: 4 }}
                        />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>
                          Live Location Unknown. Arrival time based on Schedule
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Crowd Level */}
                  <View style={styles.oneInfoContainer}>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row', position: 'absolute', top: 4 }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Seating Available</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row', position: 'absolute', top: 4 }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Standing Available</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row', position: 'absolute', top: 4 }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                          <FontAwesome6 name="user" color={colors.accent5} size={8} />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Limited Standing Available</Text>
                      </View>
                    </View>
                  </View>

                  {/* Bus Type */}
                  <View style={styles.oneInfoContainer}>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <MaterialCommunityIcons 
                          name="bus-side" 
                          color={colors.busIcon} 
                          size={15} 
                        />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Single Deck</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <MaterialCommunityIcons 
                          name="bus-double-decker" 
                          color={colors.busIcon} 
                          size={15} 
                        />
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Double Decker</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row' }}>
                          <MaterialCommunityIcons 
                            name="bus-articulated-end" 
                            color={colors.busIcon} 
                            size={15} 
                          />
                          <MaterialCommunityIcons 
                            name="bus-articulated-front" 
                            color={colors.busIcon} 
                            size={15} 
                            style={{ right: 4 }}
                          />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Bendy</Text>
                      </View>
                    </View>
                  </View>

                </View>
              </ScrollView>
            </View>
        </SafeAreaView>
    </Modal>
  );
};

export default InfoModal;