import React from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity 
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

const InfoModalComponent: React.FC<BusModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}></Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" style={styles.modalCrossIcon}/>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>

            {/* Last Updated */}
            <View style={styles.oneInfoContainer}>
              <View style={styles.oneLine}>
                
                <View style={styles.leftSide}>
                  <View style={{
                      width: scale(3),
                      height: scale(12),
                      borderRadius: scale(5), // Makes it a circle
                      backgroundColor: colors.accent,
                      position: 'absolute',
                      top: scale(4)
                    }} />
                </View>
                
                <View style={styles.rightSide}>
                  <Text style={styles.infoText}>Live Location Updated {'<'} 15 seconds ago</Text>
                </View>

              </View>
              <View style={styles.oneLine}>
                <View style={styles.leftSide}>
                    <View style={{
                        width: scale(3),
                        height: scale(12),
                        borderRadius: scale(5), // Makes it a circle
                        backgroundColor: colors.warning,
                        position: 'absolute',
                        top: scale(4)
                      }} />
                  </View>
                  
                  <View style={styles.rightSide}>
                    <Text style={styles.infoText}>Live Location Updated 15 - 45 seconds ago</Text>
                  </View>
                  
                </View>
              <View style={styles.oneLine}>
              <View style={styles.leftSide}>
                <View style={{
                    width: scale(3),
                    height: scale(12),
                    borderRadius: scale(5), // Makes it a circle
                    backgroundColor: colors.error,
                    position: 'absolute',
                    top: scale(4)
                  }} />
                </View>
                
                <View style={styles.rightSide}>
                  <Text style={styles.infoText}>Last Update {'>'} 45 seconds ago</Text>
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
                      style={{position: 'absolute', top: scale(4)}}
                    />
                  </View>
                  <View style={styles.rightSide}>
                    <Text style={styles.infoText}>Live Location Unknown. Arrival Time is based on Schedule</Text>
                  </View>

                </View>
            </View>

            {/* Crowd Level */}
            <View style={styles.oneInfoContainer}>
              <View style={styles.oneLine}>
                
                <View style={styles.leftSide}>
                  <View style={{flexDirection: 'row', position: 'absolute', top: scale(4)}}>
                    <FontAwesome6 name="user" color={colors.accent5} size={scale(8)} />
                  </View>
                </View>
                
                <View style={styles.rightSide}>
                  <Text style={styles.infoText}>Seating Available</Text>
                </View>

              </View>
              <View style={styles.oneLine}>
                <View style={styles.leftSide}>
                  <View style={{flexDirection: 'row', position: 'absolute', top: scale(4)}}>
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
                <View style={{flexDirection: 'row', position: 'absolute', top: scale(4)}}>
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
                  <MaterialCommunityIcons name="bus-side" color={colors.busIcon} size={scale(15)} />
                </View>
                
                <View style={styles.rightSide}>
                  <Text style={styles.infoText}>Single Deck</Text>
                </View>

              </View>
              <View style={styles.oneLine}>
                <View style={styles.leftSide}>
                    <MaterialCommunityIcons name="bus-double-decker" color={colors.busIcon} size={scale(15)} />
                  </View>
                  
                  <View style={styles.rightSide}>
                    <Text style={styles.infoText}>Double Decker</Text>
                  </View>
                  
                </View>
              <View style={styles.oneLine}>
              <View style={styles.leftSide}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons name="bus-articulated-end" color={colors.busIcon} size={scale(15)} />
                  <MaterialCommunityIcons name="bus-articulated-front" color={colors.busIcon} size={scale(15)} style={{right: scale(4)}}/>
                </View>
                </View>
                
                <View style={styles.rightSide}>
                  <Text style={styles.infoText}>Bendy</Text>
                </View>
              </View>
          
            </View>

          </View>
        
          {/* Not part of infoContainer */}
          </View>
        </View>
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
      },
      infoText: {
        fontSize: scale(12),
        fontFamily: font.bold,
        color: colors.onSurface,
        textAlign: "left",
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
});

export default InfoModalComponent;