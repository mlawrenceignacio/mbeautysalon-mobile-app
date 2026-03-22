import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Loading from "../components/Loading";
import { getReservations } from "../services/data";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";

const History = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [doneReservations, setDoneReservations] = useState<any[]>([]);
  const [showTopButton, setShowTopButton] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, []),
  );

  async function load() {
    setIsLoading(true);
    try {
      const result = await getReservations();

      if (!result) return;

      const filteredReservations = result?.reservations?.filter(
        (r: any) => r.status === "Done",
      );

      setDoneReservations(filteredReservations);

      setIsLoading(false);
    } catch (err: any) {
      console.error("Reservation load failed: ", err?.res?.status);
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loading />;

  function scrollToTop() {
    scrollRef.current?.scrollTo({
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
          }}
        >
          <Ionicons name="checkmark-circle" size={30} color={"#790808"} />
          <Text style={[styles.headerText, { textAlign: "center", flex: 1 }]}>
            DONE RESERVATIONS
          </Text>
        </View>

        <View
          style={{
            gap: 10,
          }}
        >
          <View
            style={[styles.cardNote, { paddingHorizontal: 5, width: "100%" }]}
          >
            <Ionicons name="alert-circle-outline" size={20} color="#790808" />
            <Text
              style={[styles.cardNoteText, { flex: 1, paddingHorizontal: 5 }]}
            >
              History of done reservations are displayed here.
            </Text>
          </View>

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
        {doneReservations.length === 0 && (
          <View
            style={{
              backgroundColor: "#4d4d4dff",
              marginTop: 20,
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "white",
              }}
            >
              No cancelled reservation requests.
            </Text>
          </View>
        )}

        {doneReservations.map((r: any) => (
          <View key={r._id} style={styles.reservationCard}>
            <View style={styles.cardRow}>
              <Ionicons name="person-circle" size={22} color={"#790808"} />
              <Text style={styles.cardName}>{r.clientName.toUpperCase()}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="briefcase-outline" size={20} color={"#790808"} />
              <Text style={styles.cardValue}>{r.service?.toUpperCase()}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={20} color={"#790808"} />
              <Text style={styles?.cardValue}>{r?.time}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={20} color={"#790808"} />
              <Text style={styles?.cardValue}>{formatDate(r.date)}</Text>
            </View>

            <View style={styles.cardStatusRow}>
              <Ionicons name="ellipse" size={12} color={"#4f4f4fff"} />
              <Text style={styles.cardStatusText}>
                {r.status.toUpperCase()}
              </Text>
            </View>

            {r.decisionReason && (
              <View style={styles.cardNote}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#790808"
                />
                <Text style={styles.cardNoteText}>{r.decisionReason}</Text>
              </View>
            )}

            {r.extraNote ? (
              <View style={styles.cardNote}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={"#790808"}
                />
                <Text style={styles.cardNoteText}>{r?.extraNote}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default History;
