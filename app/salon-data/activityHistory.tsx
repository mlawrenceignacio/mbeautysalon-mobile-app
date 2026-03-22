import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Loading from "../components/Loading";
import { getAdminActivities, getAllAdminActivities } from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const ActivityHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("Admin");
  const [allAdminActivities, setAllAdminActivities] = useState<any[]>([]);
  const [currentAdminActivities, setCurrentAdminActivities] = useState<any[]>(
    [],
  );
  const [showTopButton, setShowTopButton] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);

  const { user } = useAuthStore();
  const adminId = user?._id;

  async function load() {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      const res1 = await getAllAdminActivities();
      const res2 = await getAdminActivities(adminId);

      if (!res1.activities) {
        setIsLoading(false);
        return;
      }
      if (!res2.found) {
        setIsLoading(false);
        return;
      }

      setAllAdminActivities(res1.activities);
      setCurrentAdminActivities(res2.found);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err?.res?.status);
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, []),
  );

  if (isLoading) return <Loading />;

  function scrollToTop() {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            marginBottom: 5,
            paddingHorizontal: 10,
            gap: 5,
          }}
        >
          <Ionicons name="time-sharp" size={30} color={"#790808"} />
          <Text style={[styles.headerText, { textAlign: "center" }]}>
            Activity History
          </Text>
        </View>

        <View>
          {showTopButton && (
            <TouchableOpacity
              onPress={scrollToTop}
              style={{
                backgroundColor: "#790808",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Ionicons name="arrow-up" color={"white"} size={20} />
              <Text style={{ color: "white", fontWeight: "700" }}>TOP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
            borderColor: "black",
            borderWidth: 1,
            paddingVertical: 10,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setCategory("Admin")}
            style={{
              backgroundColor: category === "Admin" ? "#790808" : "white",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                paddingVertical: 10,
                width: 120,
                textAlign: "center",
                color: category === "Admin" ? "white" : "#790808",
                fontWeight: category === "Admin" ? "bold" : "normal",
              }}
            >
              Your Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCategory("All Admin")}
            style={{
              backgroundColor: category === "All Admin" ? "#790808" : "white",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                paddingVertical: 10,
                width: 120,
                textAlign: "center",
                color: category === "All Admin" ? "white" : "#790808",
                fontWeight: category === "All Admin" ? "bold" : "normal",
              }}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;

          setShowTopButton(yOffset > 250);
        }}
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
      >
        {category === "Admin" && currentAdminActivities.length === 0 && (
          <View
            style={{
              backgroundColor: "#4d4d4dff",
              marginTop: 20,
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="alert-circle-outline" size={20} color="white" />
            <Text style={{ color: "white", marginTop: 5 }}>
              No activities available.
            </Text>
          </View>
        )}

        {category === "All Admin" && allAdminActivities.length === 0 && (
          <View
            style={{
              backgroundColor: "#4d4d4dff",
              marginTop: 20,
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="alert-circle-outline" size={20} color="white" />
            <Text style={{ color: "white", marginTop: 5 }}>
              No activities available.
            </Text>
          </View>
        )}

        {category === "All Admin" &&
          allAdminActivities &&
          allAdminActivities.map((a) => (
            <View key={a._id} style={styles.reservationCard}>
              <View style={styles.cardRow}>
                <Ionicons name="person-circle" size={22} color={"#790808"} />
                <Text>Admin: {a.adminUsername.toUpperCase()}</Text>
              </View>

              <View style={[styles.cardRow, { alignItems: "flex-start" }]}>
                <Ionicons name="mail-outline" size={22} color={"#790808"} />
                <Text style={{ flex: 1 }}>{a.adminEmail}</Text>
              </View>

              <View style={[styles.cardRow, { alignItems: "flex-start" }]}>
                <Ionicons name="list-outline" size={22} color={"#790808"} />
                <Text style={{ flex: 1 }}>{a.activityName}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="timer-outline" size={22} color={"#790808"} />
                <Text>
                  {formatDate(a.createdAt)} at {formatTime(a.createdAt)}
                </Text>
              </View>
            </View>
          ))}

        {category === "Admin" && (
          <View>
            {currentAdminActivities &&
              currentAdminActivities.map((a) => (
                <View key={a._id} style={styles.reservationCard}>
                  <View style={styles.cardRow}>
                    <Ionicons
                      name="person-circle"
                      size={22}
                      color={"#790808"}
                    />
                    <Text>Admin: {a.adminUsername.toUpperCase()}</Text>
                  </View>

                  <View style={[styles.cardRow, { alignItems: "flex-start" }]}>
                    <Ionicons name="mail-outline" size={22} color={"#790808"} />
                    <Text style={{ flex: 1 }}>{a.adminEmail}</Text>
                  </View>

                  <View style={[styles.cardRow, { alignItems: "flex-start" }]}>
                    <Ionicons name="list-outline" size={22} color={"#790808"} />
                    <Text style={{ flex: 1 }}>{a.activityName}</Text>
                  </View>

                  <View style={styles.cardRow}>
                    <Ionicons
                      name="timer-outline"
                      size={22}
                      color={"#790808"}
                    />
                    <Text>
                      {formatDate(a.createdAt)} at {formatTime(a.createdAt)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityHistory;
