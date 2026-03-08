import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserLite = {
  _id: string;
  email: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  initialMessage: string;
  setInitialMessage: (value: string) => void;
  creating: boolean;
  onCreate: () => void;
  users: UserLite[];
};

const wine = "#790808";
const border = "#E5E7EB";
const textDark = "#111827";
const textMuted = "#6B7280";

export default function CreateMessageModal({
  visible,
  onClose,
  recipientEmail,
  setRecipientEmail,
  initialMessage,
  setInitialMessage,
  creating,
  onCreate,
}: Props) {
  const insets = useSafeAreaInsets();
  const showError = !recipientEmail.trim() || !initialMessage.trim();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: 24,
            paddingBottom: Math.max(insets.bottom, 5),
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              maxHeight: "100%",
              minHeight: 320,
              overflow: "hidden",
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              contentContainerStyle={{ padding: 18, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  color: textDark,
                  marginBottom: 12,
                }}
              >
                New Message
              </Text>

              <Text
                style={{
                  color: textMuted,
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                Recipient email
              </Text>

              <TextInput
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                placeholder="Enter recipient email..."
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
                style={{
                  borderWidth: 1,
                  borderColor: border,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: textDark,
                }}
              />

              <Text
                style={{
                  color: textMuted,
                  fontSize: 12,
                  marginTop: 12,
                  marginBottom: 6,
                }}
              >
                Initial message
              </Text>

              <TextInput
                value={initialMessage}
                onChangeText={setInitialMessage}
                placeholder="Type your message..."
                multiline
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                style={{
                  borderWidth: 1,
                  borderColor: border,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  minHeight: 120,
                  color: textDark,
                }}
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.9}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: 14,
                    paddingVertical: 13,
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Text style={{ color: textDark, fontWeight: "800" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onCreate}
                  disabled={creating || showError}
                  activeOpacity={0.9}
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    paddingVertical: 13,
                    alignItems: "center",
                    backgroundColor: wine,
                    opacity: creating || showError ? 0.6 : 1,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "800" }}>
                    {creating ? "Sending..." : "Send"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
