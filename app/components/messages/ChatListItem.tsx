import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  timeLabel?: string;
  unreadCount?: number;
  onPress: () => void;
};

const wine = "#790808";
const textDark = "#111827";
const textMuted = "#6B7280";
const border = "#E5E7EB";
const bg = "#FFFFFF";

export default function ChatListItem({
  title,
  subtitle,
  timeLabel,
  unreadCount = 0,
  onPress,
}: Props) {
  const hasUnread = unreadCount > 0;

  const initial = (title?.trim()?.[0] || "?").toUpperCase();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View
        style={{
          backgroundColor: bg,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: border,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#fff4f7",
            borderWidth: 1,
            borderColor: "#f2ccd4",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ fontWeight: "800", color: wine }}>{initial}</Text>
        </View>

        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: hasUnread ? "800" : "700",
              color: textDark,
            }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginTop: 3,
              fontSize: 13,
              color: textMuted,
              fontWeight: hasUnread ? "700" : "500",
            }}
          >
            {subtitle}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", minWidth: 64 }}>
          <Text style={{ fontSize: 11, color: textMuted }}>
            {timeLabel || ""}
          </Text>

          {hasUnread ? (
            <View
              style={{
                marginTop: 6,
                minWidth: 22,
                height: 22,
                borderRadius: 11,
                paddingHorizontal: 7,
                backgroundColor: wine,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800", fontSize: 12 }}>
                {unreadCount}
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginTop: 12,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "transparent",
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
