import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { getReservations } from "../services/data";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";

const CalendarScreen = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, []),
  );

  async function load() {
    try {
      const res = await getReservations();
      const confirmedReservations = res?.reservations
        ?.filter((r: any) => r.status === "Confirmed")
        .map((r: any) => ({
          ...r,
          date: r.date.split("T")[0],
        }));

      setReservations(confirmedReservations);
    } catch (err: any) {
      console.error("Reservation load failed: ", err?.res?.status);
    }
  }

  const markedDates = reservations.reduce((acc: any, r: any) => {
    const color = "#008000";

    acc[r.date] = {
      marked: true,
      dotColor: color,
      customStyles: {
        container: { backgroundColor: color },
        text: { color: "white", fontWeight: "bold" },
      },
    };

    return acc;
  }, {});

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "white" }}>
        <View style={styles.headerCont}>
          <Ionicons name="calendar" size={30} color={"#700041"} />
          <Text style={styles.headerText}>CALENDAR</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 15, paddingTop: 0 }}
      >
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markingType="custom"
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: "#790808",
            },
          }}
        />

        <Text style={styles.subHeadText}>
          Reservatons on ({selectedDate ? formatDate(selectedDate) : "..."})
        </Text>

        {selectedDate &&
          reservations
            .filter((r) => r.date === selectedDate)
            .map((r) => (
              <View
                key={String(
                  r._id ??
                    r.id ??
                    `${r.date}-${r.time}-${r.clientName}-${r.email}`,
                )}
                style={styles.reservationCard}
              >
                <View style={styles.cardRow}>
                  <Ionicons name="person-circle" size={22} color="#790808" />
                  <Text style={styles.cardName}>{r.clientName}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons
                    name="briefcase-outline"
                    size={20}
                    color="#790808"
                  />
                  <Text style={styles.cardValue}>
                    {typeof r.service === "string"
                      ? r.service.toUpperCase()
                      : ""}
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="time-outline" size={20} color="#790808" />
                  <Text style={styles.cardValue}>{r.time}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="mail-outline" size={20} color="#790808" />
                  <Text style={styles.cardValue}>{r.email}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="call-outline" size={20} color="#790808" />
                  <Text style={styles.cardValue}>{r.phone}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Ionicons name="location-outline" size={20} color="#790808" />
                  <Text style={styles.cardValue}>
                    {typeof r.address === "string"
                      ? r.address.toUpperCase()
                      : ""}
                  </Text>
                </View>

                <View style={styles.cardStatusRow}>
                  <Ionicons name="ellipse" size={12} color="#008000" />
                  <Text style={styles.cardStatusText}>
                    {typeof r.status === "string" ? r.status.toUpperCase() : ""}
                  </Text>
                </View>

                {r.extraNote ? (
                  <View style={styles.cardNote}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#790808"
                    />
                    <Text style={styles.cardNoteText}>{r.extraNote}</Text>
                  </View>
                ) : null}
              </View>
            ))}

        {selectedDate &&
          reservations.filter((r) => r.date === selectedDate).length === 0 && (
            <Text style={{ marginTop: 10, textAlign: "center" }}>
              There are no confirmed reservations for this date.
            </Text>
          )}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
