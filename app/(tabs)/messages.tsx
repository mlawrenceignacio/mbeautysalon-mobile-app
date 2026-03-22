import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Popup from "../components/Popup";

import api from "../services/api";
import socket from "../services/socket";
import { useAuthStore } from "../store/auth.store";

import Loading from "../components/Loading";
import ChatListItem from "../components/messages/ChatListItem";
import CreateMessageModal from "../components/messages/CreateMessageModal";

interface ChatUser {
  _id: string;
  name?: string;
  email: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface WebUser {
  _id: string;
  email: string;
  username?: string;
  name?: string;
}

const wine = "#790808";
const bg = "#FFFFFF";
const border = "#E5E7EB";
const textDark = "#111827";
const textMuted = "#6B7280";

const formatTimeLabel = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const sortByLast = (list: ChatUser[]) =>
  [...list].sort(
    (a, b) =>
      new Date(b.lastMessageTime || 0).getTime() -
      new Date(a.lastMessageTime || 0).getTime(),
  );

export default function Messages() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<ChatUser[]>([]);

  const [searchEmail, setSearchEmail] = useState("");

  const activeChatUserIdRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const [webUsers, setWebUsers] = useState<WebUser[]>([]);
  const webUserById = useMemo(() => {
    const map = new Map<string, WebUser>();
    webUsers.forEach((u) => map.set(u._id, u));
    return map;
  }, [webUsers]);

  const loadWebUsers = useCallback(async () => {
    try {
      const res = await api.get("/user/web-users");
      setWebUsers(res.data.users || []);
    } catch {
      setWebUsers([]);
    }
  }, []);

  const loadChatUsers = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setIsLoading(true);
    try {
      socket.emit("joinAdmins");

      const res = await api.get("/chat/users");
      const baseUsers: ChatUser[] = (res.data.users || []).map(
        (u: ChatUser) => ({
          ...u,
          unreadCount: 0,
        }),
      );

      const enriched = await Promise.all(
        baseUsers.map(async (u) => {
          try {
            const chatsRes = await api.get(`/chat/${u._id}`);
            const all = chatsRes.data.chats || [];
            const last = all[all.length - 1];

            const unread = all.filter(
              (c: any) => c.sender === "user" && !c.seenByAdmin,
            ).length;

            return {
              ...u,
              lastMessage: last?.message,
              lastMessageTime: last?.createdAt,
              unreadCount: unread,
            } as ChatUser;
          } catch {
            return u;
          }
        }),
      );

      setUsers(sortByLast(enriched));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    loadWebUsers();
    loadChatUsers();
  }, [user, loadWebUsers, loadChatUsers]);

  useFocusEffect(
    useCallback(() => {
      activeChatUserIdRef.current = null;
      loadChatUsers();
      return () => {
        activeChatUserIdRef.current = null;
      };
    }, [loadChatUsers]),
  );

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const handleConnect = () => {
      socket.emit("joinAdmins");
    };

    const onNewMessage = async (msg: any) => {
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u._id === msg.userId);
        const isChatOpen = activeChatUserIdRef.current === msg.userId;

        if (idx !== -1) {
          const updated = prev.map((u) => {
            if (u._id !== msg.userId) return u;
            return {
              ...u,
              lastMessage: msg.message,
              lastMessageTime: msg.createdAt,
              unreadCount:
                msg.sender === "user" && !isChatOpen
                  ? (u.unreadCount || 0) + 1
                  : u.unreadCount || 0,
            };
          });
          return sortByLast(updated);
        }

        const info = webUserById.get(msg.userId);
        const title = info?.username || info?.name || info?.email || "Unknown";
        const email = info?.email || "unknown@email";

        const newRow: ChatUser = {
          _id: msg.userId,
          name: title,
          email,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.sender === "user" ? 1 : 0,
        };

        return sortByLast([newRow, ...prev]);
      });
    };

    socket.on("connect", handleConnect);
    socket.on("newMessage", onNewMessage);

    socket.connect();

    if (socket.connected) {
      socket.emit("joinAdmins");
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", onNewMessage);
    };
  }, [user, webUserById]);

  const filteredUsers = useMemo(() => {
    const q = searchEmail.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, searchEmail]);

  const openChat = async (userId: string) => {
    activeChatUserIdRef.current = userId;

    await api.put(`/chat/seen/${userId}`);

    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, unreadCount: 0 } : u)),
    );

    router.push({ pathname: "/chats/ChatBoxMobile", params: { userId } });
  };

  const openCreateModal = async () => {
    setRecipientEmail("");
    setInitialMessage("");
    setCreateOpen(true);

    if (webUsers.length === 0) await loadWebUsers();
  };

  const createMessage = async () => {
    const email = recipientEmail.trim().toLowerCase();
    const msg = initialMessage.trim();
    if (!email || !msg) {
      setPopup("All fields are required.");
      return;
    }

    const recipient = webUsers.find((u) => u.email?.toLowerCase() === email);
    if (!recipient?._id) {
      setPopup("Web user not found.");
      return;
    }

    const now = new Date().toISOString();

    setUsers((prev) => {
      const exists = prev.some((u) => u._id === recipient._id);

      const row: ChatUser = {
        _id: recipient._id,
        name: recipient.username || recipient.name || recipient.email,
        email: recipient.email,
        lastMessage: msg,
        lastMessageTime: now,
        unreadCount: 0,
      };

      return sortByLast(
        exists
          ? prev.map((u) => (u._id === row._id ? row : u))
          : [row, ...prev],
      );
    });

    try {
      setCreating(true);
      await api.post("/chat", { userId: recipient._id, message: msg });
      setCreateOpen(false);

      openChat(recipient._id);
    } catch {
      setPopup("Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {popup.trim() && <Popup message={popup} onClose={() => setPopup("")} />}

      <View
        style={{
          paddingHorizontal: 14,
          borderBottomWidth: 1,
          borderBottomColor: border,
          backgroundColor: bg,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "900", color: textDark }}>
          Messages
        </Text>
        <Text style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
          Search by email and manage conversations
        </Text>
      </View>

      <View
        style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: border }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: border,
            backgroundColor: "#F9FAFB",
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <TextInput
            value={searchEmail}
            onChangeText={setSearchEmail}
            placeholder="Search email…"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ color: textDark, fontSize: 14 }}
          />
        </View>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatListItem
              title={item.email}
              subtitle={item.lastMessage || "No messages yet"}
              timeLabel={formatTimeLabel(item.lastMessageTime)}
              unreadCount={item.unreadCount || 0}
              onPress={() => openChat(item._id)}
            />
          )}
          ListEmptyComponent={
            <View style={{ padding: 18 }}>
              <Text style={{ color: textMuted, textAlign: "center" }}>
                No conversations found.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        onPress={openCreateModal}
        activeOpacity={0.9}
        style={{
          position: "absolute",
          right: 18,
          bottom: 22,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: wine,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Text style={{ color: "white", fontSize: 26, fontWeight: "900" }}>
          +
        </Text>
      </TouchableOpacity>

      <CreateMessageModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        recipientEmail={recipientEmail}
        setRecipientEmail={setRecipientEmail}
        initialMessage={initialMessage}
        setInitialMessage={setInitialMessage}
        creating={creating}
        onCreate={createMessage}
        users={webUsers.map((u) => ({ _id: u._id, email: u.email }))}
      />
    </SafeAreaView>
  );
}
