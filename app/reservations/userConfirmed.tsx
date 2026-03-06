import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DCInput from "../components/DCInput";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import {
  addAdminActivity,
  getReservations,
  updateReservationStatus,
  updateReservationStatusWithReason,
} from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";

const UserConfirmed = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState("");

  const scrollRef = useRef<ScrollView | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const { user } = useAuthStore();
  const adminId = user?._id;
  const adminUsername = user?.username;
  const adminEmail = user?.email;
  const [customerDetails, setCustomerDetails] = useState<{
    clientEmail: string;
    clientName: string;
    schedule: {
      date: string;
      time: string;
    };
  } | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const res = await getReservations();

      if (!res) {
        setIsLoading(false);
        return;
      }

      const filteredReservation = res?.reservations.filter(
        (r: any) => r.status === "UserConfirmed",
      );

      setReservations(filteredReservation);

      setIsLoading(false);
    } catch (err: any) {
      console.error("Reservations load failed: ", err?.res?.status);
      setIsLoading(false);
    }
  }

  const handleStatusChange = async (
    id: string,
    status:
      | "Pending"
      | "EmailSent"
      | "UserConfirmed"
      | "Confirmed"
      | "Declined"
      | "Cancelled"
      | "Done",
    details: {
      clientEmail: string;
      clientName: string;
      date: string;
      time: string;
    },
  ) => {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      await updateReservationStatus(id, status);

      await addAdminActivity(adminId, {
        adminUsername,
        activityName: `Marked customer ${details.clientName}'s (${details.clientEmail}) confirmed reservation scheduled on ${formatDate(details.date)} at ${details.time} as DONE.`,
        adminEmail,
      });

      if (status === "UserConfirmed") setPopup("Successful!");
      await load();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCancel = async (reason: string) => {
    setIsLoading(true);
    if (!selectedId || !adminId) {
      setIsLoading(false);
      return;
    }

    try {
      await updateReservationStatusWithReason(selectedId, "Cancelled", reason);

      await addAdminActivity(adminId, {
        adminUsername,
        activityName: `Cancelled customer ${customerDetails?.clientName}'s (${
          customerDetails?.clientEmail
        }) user-confirmed reservation request scheduled on ${formatDate(
          customerDetails!.schedule.date,
        )} at ${customerDetails!.schedule.time}.`,
        adminEmail,
      });

      setIsLoading(false);
      setCancelVisible(false);
      setSelectedId(null);
      setPopup("Reservation cancelled.");
      load();
    } catch (err) {
      console.error("Cancel failed", err);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();

      return () => {};
    }, []),
  );

  if (isLoading) return <Loading />;

  function scrollToTop() {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      {popup.trim().length > 0 && (
        <Popup message={popup} onClose={() => setPopup("")} />
      )}

      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View style={styles.headerCont}>
          <Ionicons name="person-circle" size={27} color="#790808" />
          <Text style={styles.headerText}>USER CONFIRMED</Text>
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
              User-confirmed reservations through email are seen here. Approve
              or Cancel them.
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
        contentContainerStyle={{ padding: 15, paddingTop: 0 }}
      >
        {reservations &&
          !isLoading &&
          reservations.map((r) => (
            <View key={r._id} style={styles.reservationCard}>
              <View style={styles.cardRow}>
                <Ionicons name="person-circle" size={22} color={"#790808"} />
                <Text style={styles.cardName}>
                  {r?.clientName?.toUpperCase()}
                </Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="mail-outline" size={22} color={"#790808"} />
                <Text style={styles.cardValue}>{r?.email}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="call-outline" size={22} color={"#790808"} />
                <Text style={styles.cardValue}>{r?.phone}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={"#790808"}
                />
                <Text style={styles.cardValue}>{r.service?.toUpperCase()}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="time-outline" size={20} color={"#790808"} />
                <Text style={styles.cardValue}>{r?.time}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={20} color={"#790808"} />
                <Text style={styles.cardValue}>{formatDate(r?.date)}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  alignSelf: "flex-start",
                  backgroundColor: "#ffe5ea",
                  borderRadius: 12,
                  marginTop: 8,
                  marginBottom: 10,
                }}
              >
                <Ionicons name="ellipse" size={12} color={"#d4a017"} />
                <Text style={styles.cardStatusText}>USER CONFIRMED</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#790808",
                      paddingVertical: 6,
                      paddingHorizontal: 9,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setCustomerDetails({
                        clientEmail: r.email,
                        clientName: r.clientName,
                        schedule: {
                          date: r.date,
                          time: r.time,
                        },
                      });
                      handleStatusChange(r._id, "Confirmed", {
                        clientEmail: r.email,
                        clientName: r.clientName,
                        date: r.date,
                        time: r.time,
                      });
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Approve
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#b02a37",
                      paddingVertical: 6,
                      paddingHorizontal: 9,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setCustomerDetails({
                        clientEmail: r.email,
                        clientName: r.clientName,
                        schedule: {
                          date: r.date,
                          time: r.time,
                        },
                      });
                      setSelectedId(r._id);
                      setCancelVisible(true);
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

        <DCInput
          visible={cancelVisible}
          title="Cancel Reservation"
          onCancel={() => {
            setCancelVisible(false);
            setSelectedId(null);
          }}
          onSubmit={submitCancel}
        />

        {popup && <Popup message={popup} onClose={() => setPopup("")} />}

        {reservations.length === 0 && (
          <View style={{ padding: 10 }}>
            <View
              style={{
                backgroundColor: "#797979ff",
                marginTop: 10,
                borderRadius: 10,
                paddingVertical: 20,
                paddingHorizontal: 20,
                flexDirection: "row",
              }}
            >
              <Ionicons name="alert-circle-outline" size={20} color="white" />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "white",
                }}
              >
                No user-confirmed reservation requests.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserConfirmed;
