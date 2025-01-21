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

import { colors, font } from '../../assets/styles/GlobalStyles'; 

interface BusModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoModalComponent: React.FC<BusModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}></Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" style={styles.modalCrossIcon}/>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
              
              {/* Bus Number */}
            <View style={styles.busNumberInfoContainer}>
                <View style={styles.busNumberContainer}>
                    <Text style={styles.busNumber} adjustsFontSizeToFit numberOfLines={1}>950</Text>
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Bus Number</Text>
                </View>
                </View>

          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "center",
        alignItems: "center",
      },
      modalContent: {
        width: "90%",
        backgroundColor: colors.surface,
        borderRadius: scale(6),
        padding: scale(4),
        elevation: 5, // Adds shadow for Android
        shadowColor: "#000", // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: 'red'
      },
      
      modalHeaderText: {
        flex: 1,
      },
      modalCrossIcon: {
        fontSize: scale(24),
        color: colors.secondary2,
        padding: scale(7),
        // backgroundColor: 'red'
      },



      infoContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: scale(20),
        paddingRight: scale(20),
        paddingBottom: scale(20)
      },
      
      
      busNumberInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
      },

      busNumberContainer: {
        flex: 2,
        // backgroundColor: 'red'

        
      },
    
      busNumber: {
        fontFamily: "Arial",
        fontSize: scale(19),
        fontWeight: "bold",
        marginRight: scale(30),
        color: colors.secondary
      },
    
      infoTextContainer: {
        flex: 6,
        // backgroundColor: 'yellow'

        
      },
      infoText: {
        fontSize: scale(13),
        fontFamily: font.bold,
        color: colors.onSurface,
        textAlign: "left",
      },
});

export default InfoModalComponent;