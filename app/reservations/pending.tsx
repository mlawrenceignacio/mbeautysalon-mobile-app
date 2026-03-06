import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DCInput from "../components/DCInput";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import {
  addAdminActivity,
  getReservations,
  sendReservationConfirmation,
  updateReservationStatusWithReason,
} from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const PendingReservations = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState<string | null>(null);

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
      const result = await getReservations();

      if (!result?.reservations) {
        return;
      }

      const filteredReservations = result?.reservations?.filter(
        (r: any) => r.status === "Pending",
      );

      setPending(filteredReservations);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Reservations load failed: ", err?.res?.status);
      setIsLoading(false);
      return;
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();

      return () => {};
    }, []),
  );

  if (isLoading) {
    return <Loading />;
  }

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
        <View style={styles.headerCont}>
          <Ionicons name="alert-circle" size={30} color="#d4a017" />
          <Text style={styles.headerText}>PENDING REQUESTS</Text>
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
              Pending reservation requests are seen here. These are not
              confirmed by the web user yet. Send confirmation.
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
        contentContainerStyle={{
          padding: 15,
          paddingTop: 0,
        }}
      >
        <View style={{ marginTop: 12, gap: 10 }}>
          <TouchableOpacity
            style={[styles.primaryAction, { flexDirection: "row", gap: 10 }]}
            onPress={() => router.push("/reservations/userConfirmed")}
          >
            <Ionicons
              name="checkmark-done-circle"
              size={24}
              color={"yellowgreen"}
            />
            <Text style={styles.primaryActionText}>
              View User Confirmed Reservations
            </Text>
          </TouchableOpacity>
        </View>

        {pending.map((r: any) => (
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
              <Ionicons name="briefcase-outline" size={20} color={"#790808"} />
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

            <View style={styles.cardRow}>
              <Ionicons name="settings-outline" size={20} color={"#790808"} />
              <Text style={styles.cardValue}>
                Placed on: {formatDate(r.createdAt)} at{" "}
                {formatTime(r.createdAt)}
              </Text>
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
              <Text style={styles.cardStatusText}>PENDING</Text>
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
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      r.status === "Pending" ? "#00096aff" : "#aaa",
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                  disabled={r.status !== "Pending"}
                  onPress={async () => {
                    setIsLoading(true);

                    try {
                      if (!adminId) {
                        setIsLoading(false);
                        return;
                      }

                      await sendReservationConfirmation(r._id);

                      await addAdminActivity(adminId, {
                        adminUsername,
                        activityName: `Sent a reservation email confirmation to ${
                          r.clientName
                        } (${r.email}) scheduled on ${formatDate(r.date)} at ${r.time}.`,
                        adminEmail,
                      });

                      setPopup("Confirmation sent!");
                      await load();
                    } catch (err) {
                      console.error("Send confirmation failed:", err);
                      setPopup("Failed to send confirmation.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Send Confirmation
                  </Text>
                </TouchableOpacity>
              </View>

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
                    backgroundColor: "#d9534f",
                    padding: 8,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setSelectedId(r._id);
                    setCustomerDetails({
                      clientEmail: r.email,
                      clientName: r.clientName,
                      schedule: {
                        date: r.date,
                        time: r.time,
                      },
                    });
                    setReasonModal(true);
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {r?.extraNote ? (
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

        <DCInput
          visible={reasonModal}
          title="Reason for declining"
          onCancel={() => {
            setReasonModal(false);
            setSelectedId(null);
          }}
          onSubmit={async (reason) => {
            setIsLoading(true);
            if (!selectedId || !adminId) {
              setIsLoading(false);
              return;
            }

            try {
              await updateReservationStatusWithReason(
                selectedId,
                "Declined",
                reason,
              );

              await addAdminActivity(adminId, {
                adminUsername,
                activityName: `Declined the reservation of ${
                  customerDetails?.clientName
                } (${customerDetails?.clientEmail}) scheduled on ${formatDate(
                  customerDetails!.schedule.date,
                )} at ${customerDetails!.schedule.time}.`,
                adminEmail,
              });

              setIsLoading(false);
              setPopup("Reservation declined.");
              load();
            } catch (err) {
              console.error(err);
              setIsLoading(false);
              setPopup("Failed to decline reservation.");
            } finally {
              setReasonModal(false);
              setSelectedId(null);
            }

            load();
          }}
        />

        {pending.length === 0 && (
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
                No pending reservation requests.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {popup && <Popup message={popup} onClose={() => setPopup(null)} />}
    </View>
  );
};

export default PendingReservations;
