import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#790808" />
    </View>
  );
};

export default Loading;
