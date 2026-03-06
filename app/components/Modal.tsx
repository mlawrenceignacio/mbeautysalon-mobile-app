import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  message: string;
  func1: () => void;
  func2: () => void;
  func1Text: string;
  func2Text: string;
};

const ConfirmationModal: React.FC<Props> = ({
  message,
  func1,
  func2,
  func1Text,
  func2Text,
}) => {
  return (
    <Modal transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20,
          alignItems: "center",
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
              marginBottom: 10,
            }}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={func1}
              style={{
                backgroundColor: "#008b1eff",
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {func1Text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={func2}
              style={{
                backgroundColor: "#800000ff",
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {func2Text}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
