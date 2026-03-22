import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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
const HEADER_HEIGHT = 40;

export default function ChatBoxMobile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Message> | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    api
      .get(`/user/search/${userId}`)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, [userId]);

  useEffect(() => {
    if (!userId || !socket) return;

    let mounted = true;

    const handleConnect = () => {
      socket.emit("joinRoom", userId.toString());
    };

    const onMessage = (msg: Message) => {
      if (msg.userId !== userId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev.filter((m) => !m._id.startsWith("temp-")), msg];
      });
    };

    const load = async () => {
      try {
        const res = await api.get(`/chat/${userId}`);
        if (mounted) {
          setMessages(res.data.chats || []);
        }
      } catch {
        if (mounted) {
          setMessages([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    socket.on("connect", handleConnect);
    socket.on("newMessage", onMessage);
    socket.connect();
    load();

    return () => {
      mounted = false;
      socket.off("connect", handleConnect);
      socket.off("newMessage", onMessage);
    };
  }, [userId]);

  const data = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeDiff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      if (timeDiff !== 0) return timeDiff;

      return b._id.localeCompare(a._id);
    });
  }, [messages]);

  const sendMessage = async () => {
    const clean = text.trim();
    if (!clean || !userId || sending) return;

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
    setSending(true);

    try {
      const res = await api.post("/chat", { message: clean, userId });
      const real = res.data.chat;

      setMessages((prev) => prev.map((m) => (m._id === tempId ? real : m)));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setText(clean);
      console.error("Send message failed:", err);
    } finally {
      setSending(false);
    }
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: bg }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: bg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
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
            {user?.email || ""}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={wine} />
            </View>
          ) : (
            <FlatList
              ref={listRef}
              inverted
              data={data}
              keyExtractor={(item) => item._id}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingTop: 14,
                paddingBottom: 12,
              }}
              style={{ flex: 1, backgroundColor: bg }}
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
                      <View
                        style={{ alignItems: "center", marginVertical: 10 }}
                      >
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
                        maxWidth: "82%",
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: isAdmin ? wine : "#F3F4F6",
                          borderRadius: 18,
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: isAdmin ? "white" : textDark,
                            fontSize: 15,
                            lineHeight: 21,
                          }}
                        >
                          {item.message}
                        </Text>
                      </View>

                      <Text
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          color: textMuted,
                          textAlign: isAdmin ? "right" : "left",
                        }}
                      >
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: border,
            backgroundColor: bg,
            paddingHorizontal: 12,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 50),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={{
                flex: 1,
                minHeight: 44,
                maxHeight: 120,
                borderWidth: 1,
                borderColor: border,
                borderRadius: 16,
                backgroundColor: "#F9FAFB",
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: textDark,
              }}
            />

            <TouchableOpacity
              onPress={sendMessage}
              disabled={!text.trim() || sending}
              activeOpacity={0.9}
              style={{
                backgroundColor: wine,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 14,
                opacity: !text.trim() || sending ? 0.6 : 1,
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>
                {sending ? "..." : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
