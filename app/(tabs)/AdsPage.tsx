import React from "react";
import { View , Text} from "react-native";

import { containerStyles } from "@/assets/styles/GlobalStyles";
import PayLahComponent from "../../components/main/PayLahComponent";
import PayPalComponent from "@/components/main/PayPalComponent";
import { scale } from "react-native-size-matters";


const App = () => {

  return (
    <View style={containerStyles.pageContainer}>
      <Text style={[containerStyles.globalTextMessage, {marginBottom: scale(10)}]}>just kidding, i hate ads</Text>
        <View style={{flexDirection: 'row'}}>
          <PayLahComponent />
          <PayPalComponent />
        </View>
    </View>
  );
};

export default App;
