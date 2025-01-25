import React from "react";
import { View , Text, Image, StyleSheet} from "react-native";

import { containerStyles } from "@/assets/styles/GlobalStyles";
import PayLahComponent from "../../components/main/PayLahComponent";
import PayPalComponent from "@/components/main/PayPalComponent";
import { scale } from "react-native-size-matters";
import paynowQR from "../../assets/images/paynow.jpg"


const App = () => {

  return (
    <View style={containerStyles.pageContainer}>
      <Text style={[containerStyles.globalTextMessage, {marginBottom: scale(10)}]}>just kidding, i hate ads</Text>
      <View style={{flexDirection: 'row'}}>
        <PayLahComponent />
        <PayPalComponent />
      </View>
      <View style={{marginTop: scale(10)}}>
        <Image source={paynowQR} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});

export default App;
