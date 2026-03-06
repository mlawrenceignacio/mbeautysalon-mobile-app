import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const DCInput = ({
  visible,
  title,
  onSubmit,
  onCancel,
}: {
  visible: boolean;
  title: string;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!visible) setReason("");
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="#790808"
              style={{ marginTop: 2 }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {title}
            </Text>
          </View>

          <Text
            style={{
              marginTop: 6,
              marginBottom: 12,
              color: "#555",
              fontSize: 14,
            }}
          >
            Please provide a valid reason. This action cannot be undone.
          </Text>

          <TextInput
            placeholder="Enter reason..."
            placeholderTextColor="#999"
            multiline
            scrollEnabled
            value={reason}
            onChangeText={setReason}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              textAlignVertical: "top",
              height: 120,
              maxHeight: 160,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 16,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ color: "#666", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSubmit(reason)}
              disabled={!reason.trim()}
              style={{
                backgroundColor: !reason.trim() ? "#ccc" : "#790808",
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DCInput;
