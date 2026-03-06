import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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

const ConfirmedReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const [confirmed, setConfirmed] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [popup, setPopup] = useState("");

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

      if (!result) return;

      const filteredReservations = result?.reservations?.filter(
        (r: any) => r.status === "Confirmed",
      );

      setConfirmed(filteredReservations);

      setIsLoading(false);
    } catch (err: any) {
      console.error("Reservation load failed: ", err?.res?.status);
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

      if (status === "Done") setPopup("Successful!");
      await load();
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
          <Ionicons name="checkmark-circle" size={30} color={"#008000"} />
          <Text style={styles.headerText}>RESERVATIONS</Text>
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
              Confirmed reservations are seen here, you can cancel or mark them
              as done if the transaction is already completed.
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
        contentContainerStyle={{ padding: 20, paddingTop: 15 }}
      >
        {confirmed.map((r: any) => (
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
              <Ionicons name="ellipse" size={12} color={"#008000"} />
              <Text style={styles.cardStatusText}>CONFIRMED</Text>
            </View>

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

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#800000ff",
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginTop: 10,
                  alignItems: "center",
                  width: "40%",
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
                  setSelectedReservationId(r._id);
                  setReasonModalVisible(true);
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}
                >
                  CANCEL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#008000",
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginTop: 10,
                  width: "55%",
                  alignItems: "center",
                }}
                onPress={() => {
                  handleStatusChange(r._id, "Done", {
                    clientEmail: r.email,
                    clientName: r.clientName,
                    date: r.date,
                    time: r.time,
                  });
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}
                >
                  MARK AS DONE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <DCInput
          visible={reasonModalVisible}
          title="Reason for cancelling reservation"
          onCancel={() => {
            setReasonModalVisible(false);
            setSelectedReservationId(null);
          }}
          onSubmit={async (reason) => {
            setIsLoading(true);
            if (!selectedReservationId || !adminId) {
              setIsLoading(false);
              return;
            }

            try {
              await updateReservationStatusWithReason(
                selectedReservationId,
                "Cancelled",
                reason,
              );

              await addAdminActivity(adminId, {
                adminUsername,
                activityName: `Cancelled customer ${
                  customerDetails?.clientName
                }'s (${
                  customerDetails?.clientEmail
                }) confirmed reservation scheduled on ${formatDate(
                  customerDetails!.schedule.date,
                )} at ${customerDetails!.schedule.time}.`,
                adminEmail,
              });

              setIsLoading(false);
              setReasonModalVisible(false);
              setSelectedReservationId(null);
              load();
            } catch (err: any) {
              console.error(err);
              setIsLoading(false);
            }
          }}
        />

        {confirmed.length === 0 && (
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
                No confirmed reservation yet.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ConfirmedReservations;
