import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const Popup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 30,
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            gap: 10,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#790808",
              marginBottom: 15,
            }}
          >
            {message}
          </Text>

          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#790808",
                paddingVertical: 7,
                paddingHorizontal: 10,
                borderRadius: 8,
              }}
              onPress={onClose}
            >
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 14 }}
              >
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;
