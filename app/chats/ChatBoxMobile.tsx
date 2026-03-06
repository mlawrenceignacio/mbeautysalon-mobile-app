import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import api from "../services/api";
import socket from "../services/socket";
import { User } from "../types/types";
import { formatDateLabel, formatTime } from "../utils/chatFormats";

interface Message {
  _id: string;
  sender: "admin" | "user";
  userId: string;
  message: string;
  createdAt: string;
}

const wine = "#790808";
const bg = "#FFFFFF";
const border = "#E5E7EB";
const textDark = "#111827";
const textMuted = "#6B7280";

const HEADER_HEIGHT = 56;

export default function ChatBoxMobile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    api.get(`/user/search/${userId}`).then((res) => setUser(res.data.user));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => socket.emit("joinRoom", userId.toString());
    socket.on("connect", handleConnect);
    socket.connect();

    const onMessage = (msg: Message) => {
      if (msg.userId !== userId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev.filter((m) => !m._id.startsWith("temp-")), msg];
      });
    };

    socket.on("newMessage", onMessage);

    api.get(`/chat/${userId}`).then((res) => setMessages(res.data.chats || []));

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", onMessage);
    };
  }, [userId]);

  const data = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [messages]);

  const sendMessage = async () => {
    const clean = text.trim();
    if (!clean || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const temp: Message = {
      _id: tempId,
      sender: "admin",
      userId,
      message: clean,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, temp]);
    setText("");

    const res = await api.post("/chat", { message: clean, userId });
    const real = res.data.chat;

    setMessages((prev) => prev.map((m) => (m._id === tempId ? real : m)));
  };

  if (!userId) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: textMuted }}>Invalid chat</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT : 0}
      >
        <View
          style={{
            height: HEADER_HEIGHT,
            paddingHorizontal: 14,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: border,
            backgroundColor: bg,
          }}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "900", color: textDark }}
            numberOfLines={1}
          >
            {(user?.username || "USER").toUpperCase()}
          </Text>
          <Text
            style={{ fontSize: 12, color: textMuted, marginTop: 2 }}
            numberOfLines={1}
          >
            {user?.email}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            inverted
            data={data}
            keyExtractor={(item) => item._id}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingVertical: 14,
              paddingBottom: 12,
            }}
            style={{ flex: 1 }}
            renderItem={({ item, index }) => {
              const prev = data[index + 1];
              const showDate =
                !prev ||
                formatDateLabel(prev.createdAt) !==
                  formatDateLabel(item.createdAt);

              const isAdmin = item.sender === "admin";

              return (
                <View>
                  {showDate && (
                    <View style={{ alignItems: "center", marginVertical: 10 }}>
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 999,
                          backgroundColor: "#F9FAFB",
                          borderWidth: 1,
                          borderColor: border,
                        }}
                      >
                        <Text
                          style={{
                            color: textMuted,
                            fontSize: 12,
                            fontWeight: "700",
                          }}
                        >
                          {formatDateLabel(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View
                    style={{
                      alignSelf: isAdmin ? "flex-end" : "flex-start",
                      maxWidth: "78%",
                      marginVertical: 6,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: isAdmin ? wine : "#fff4f7",
                        borderWidth: isAdmin ? 0 : 1,
                        borderColor: isAdmin ? "transparent" : "#f2ccd4",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 18,
                      }}
                    >
                      <Text
                        style={{
                          color: isAdmin ? "white" : textDark,
                          fontSize: 14,
                          lineHeight: 19,
                        }}
                      >
                        {item.message}
                      </Text>
                    </View>

                    <Text
                      style={{ fontSize: 10, color: textMuted, marginTop: 3 }}
                    >
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 10,
              paddingBottom: Math.max(insets.bottom, 10),
              borderTopWidth: 1,
              borderTopColor: border,
              backgroundColor: bg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: border,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}
            >
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Message…"
                placeholderTextColor="#9CA3AF"
                multiline
                style={{
                  flex: 1,
                  color: textDark,
                  fontSize: 14,
                  lineHeight: 18,
                  maxHeight: 110,
                  paddingVertical: 0,
                }}
              />

              <TouchableOpacity
                onPress={sendMessage}
                activeOpacity={0.9}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: wine,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "900", fontSize: 14 }}
                >
                  ➤
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
