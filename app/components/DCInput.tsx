import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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

  const handleCancel = () => {
    Keyboard.dismiss();
    onCancel();
  };

  const handleSubmit = () => {
    if (!reason.trim()) return;
    Keyboard.dismiss();
    onSubmit(reason.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
          }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "android" ? 10 : 0}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingHorizontal: 24,
                paddingVertical: 0,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 20,
                    width: "100%",
                    alignSelf: "center",
                    maxWidth: 500,
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
                        color: "#222",
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
                      lineHeight: 20,
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
                    textAlignVertical="top"
                    returnKeyType="default"
                    blurOnSubmit={false}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 12,
                      padding: 12,
                      fontSize: 14,
                      minHeight: 120,
                      maxHeight: 180,
                      color: "#222",
                      backgroundColor: "#fff",
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
                    <Pressable
                      onPress={handleCancel}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                      }}
                    >
                      <Text style={{ color: "#666", fontWeight: "600" }}>
                        Cancel
                      </Text>
                    </Pressable>

                    <TouchableOpacity
                      onPress={handleSubmit}
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
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DCInput;
