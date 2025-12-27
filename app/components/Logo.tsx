import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  return (
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      <Image
        source={require("../../assets/images/logo.jpg")}
        style={{ width: 300, height: 200, resizeMode: "contain" }}
      />
    </View>
  );
};

export default Logo;
