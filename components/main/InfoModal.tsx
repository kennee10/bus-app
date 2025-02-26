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
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, font } from '../../assets/styles/GlobalStyles'; 
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface BusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<BusModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}></Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle" style={styles.modalCrossIcon}/>
                </TouchableOpacity>
              </View>

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
                            width: scale(3),
                            height: scale(12),
                            borderRadius: scale(5),
                            backgroundColor: colors.accent,
                            position: 'absolute',
                            top: scale(4)
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
                            width: scale(3),
                            height: scale(12),
                            borderRadius: scale(5),
                            backgroundColor: colors.warning,
                            position: 'absolute',
                            top: scale(4)
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
                            width: scale(3),
                            height: scale(12),
                            borderRadius: scale(5),
                            backgroundColor: colors.error,
                            position: 'absolute',
                            top: scale(4)
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
                          size={scale(14)}
                          style={{ position: 'absolute', top: scale(4) }}
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
                        <View style={{ flexDirection: 'row', position: 'absolute', top: scale(4) }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Seating Available</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row', position: 'absolute', top: scale(4) }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                        </View>
                      </View>
                      <View style={styles.rightSide}>
                        <Text style={styles.infoText}>Standing Available</Text>
                      </View>
                    </View>
                    <View style={styles.oneLine}>
                      <View style={styles.leftSide}>
                        <View style={{ flexDirection: 'row', position: 'absolute', top: scale(4) }}>
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                          <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
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
                          size={scale(15)} 
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
                          size={scale(15)} 
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
                            size={scale(15)} 
                          />
                          <MaterialCommunityIcons 
                            name="bus-articulated-front" 
                            color={colors.busIcon} 
                            size={scale(15)} 
                            style={{ right: scale(4) }}
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
          </TouchableWithoutFeedback>
          
        </View>
      </TouchableWithoutFeedback>
      
    </Modal>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "column",
    gap: scale(12.5),
    paddingLeft: scale(20),
    paddingRight: scale(20),
    paddingBottom: scale(20),
    paddingTop: scale(5),
  },
  oneInfoContainer: {
    flexDirection: "column",
    gap: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderToPress2,
    paddingBottom: scale(12.5),
  },
  oneLine: {
    flexDirection: "row",
  },
  leftSide: {
    flex: 2,
  },
  rightSide: {
    flex: 6,
    marginRight: scale(27),
  },
  infoText: {
    fontSize: scale(12),
    fontFamily: font.bold,
    color: colors.onSurface,
    textAlign: "justify",
  },
  proTipText: {
    fontSize: scale(11),
    fontFamily: font.medium,
    color: colors.onSurfaceSecondary,
    textAlign: "justify",
    marginTop: scale(2),
  },
  timingWrapper: {
    width: scale(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: scale(3),
  },
  minsWrapper: {
    justifyContent: 'flex-end',
  },
  mins: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: colors.onSurface2Secondary,
  },
  secsWrapper: {
    justifyContent: 'flex-end',
    marginLeft: scale(2),
  },
  secs: {
    fontSize: scale(6.5),
    fontWeight: "bold",
    marginBottom: scale(4),
    color: colors.onSurface2Secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.surface,
    borderRadius: scale(6),
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    padding: scale(4),
    opacity: 0.97,
    elevation: 5,
    shadowColor: "#000",
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
  // Optional: if you want to adjust the ScrollView content container styling
  scrollContainer: {
    flexGrow: 1,
  },
});

export default InfoModal;