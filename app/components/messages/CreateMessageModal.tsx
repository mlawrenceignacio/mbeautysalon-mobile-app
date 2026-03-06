import React, { useMemo } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const wine = "#790808";
const border = "#E5E7EB";
const bg = "#FFFFFF";
const textDark = "#111827";
const textMuted = "#6B7280";

type WebUser = { _id: string; email: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  recipientEmail: string;
  setRecipientEmail: (v: string) => void;
  initialMessage: string;
  setInitialMessage: (v: string) => void;
  creating: boolean;
  onCreate: () => void;
  users: WebUser[];
};

export default function CreateMessageModal({
  visible,
  onClose,
  recipientEmail,
  setRecipientEmail,
  initialMessage,
  setInitialMessage,
  creating,
  onCreate,
  users,
}: Props) {
  const email = recipientEmail.trim().toLowerCase();

  const emailExists = useMemo(() => {
    if (!email) return true;
    return users.some((u) => u.email?.toLowerCase() === email);
  }, [email, users]);

  const showError = !!email && !emailExists;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: bg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            borderTopWidth: 1,
            borderColor: border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: textDark }}>
              New message
            </Text>

            <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
              <Text style={{ color: wine, fontWeight: "800" }}>Close</Text>
            </TouchableOpacity>
          </View>

          {showError && (
            <View
              style={{
                backgroundColor: "#fff4f7",
                borderWidth: 1,
                borderColor: "#f2ccd4",
                padding: 10,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: wine, fontWeight: "800", fontSize: 12 }}>
                No user found with that email.
              </Text>
              <Text style={{ color: textMuted, fontSize: 12, marginTop: 2 }}>
                Check spelling or use an email that already exists in users.
              </Text>
            </View>
          )}

          <Text style={{ color: textMuted, fontSize: 12, marginBottom: 6 }}>
            Recipient email
          </Text>
          <TextInput
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            placeholder="user@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
            style={{
              borderWidth: 1,
              borderColor: showError ? "#f2ccd4" : border,
              backgroundColor: "#F9FAFB",
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
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
            placeholder="Type your message…"
            multiline
            placeholderTextColor="#9CA3AF"
            style={{
              borderWidth: 1,
              borderColor: border,
              backgroundColor: "#F9FAFB",
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 100,
              textAlignVertical: "top",
              color: textDark,
            }}
          />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.9}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: border,
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={{ color: textDark, fontWeight: "800" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCreate}
              disabled={creating || showError}
              activeOpacity={0.9}
              style={{
                flex: 1,
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                backgroundColor: wine,
                opacity: creating || showError ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>
                {creating ? "Sending…" : "Send"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </View>
    </Modal>
  );
}
