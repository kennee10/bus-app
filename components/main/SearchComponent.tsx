import { View, Text, StyleSheet } from "react-native"
import { ScaledSheet, verticalScale } from 'react-native-size-matters';

const SearchComponent = () => {


    return (
        <View style={styles.container}>
            <Text>Search bus stops</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: verticalScale(50),
      backgroundColor: '#CBC3E3',
      justifyContent: 'center',
      alignItems: 'center',
    }
});

export default SearchComponent;