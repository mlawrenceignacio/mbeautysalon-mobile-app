import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import "react-native-get-random-values";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import ReservationModal from "../components/ReservationModal";
import {
  addAdminActivity,
  addReservation,
  editReservation,
  getReservations,
  updateReservationStatus,
} from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";

const Reservations = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    setIsLoading(true);
    try {
      const res = await getReservations();

      if (!res?.reservations) {
        setIsLoading(false);
        return;
      }

      setReservations(res.reservations);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Reservations load failed: ", err?.res?.status);
    }
  }

  function openAdd() {
    setEditId(null);
    resetForm();
    setModalVisible(true);
  }

  function openEdit(r: any) {
    setEditId(r._id);
    setClientName(r.clientName);
    setEmail(r.email);
    setContact(r.phone);
    setAddress(r.address);
    setExtraNote(r.note || "");

    setServices(
      typeof r.service === "string"
        ? r.service.split(", ").map((s: string) => s.trim())
        : []
    );

    setDate(r.date);
    setTime(r.time);
    setServiceInput("");
    setModalVisible(true);
  }

  function resetForm() {
    setClientName("");
    setEmail("");
    setContact("");
    setAddress("");
    setExtraNote("");
    setServiceInput("");
    setServices([]);
    setDate("");
    setTime("");
  }

  async function save() {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      if (!clientName.trim()) {
        setIsLoading(false);
        return Alert.alert("Invalid Name", "Client Name is required.");
      }

      if (!email.trim() || !isValidEmail(email)) {
        setIsLoading(false);
        return Alert.alert(
          "Invalid Email",
          "Please enter a valid email address."
        );
      }

      if (services.length === 0) {
        setIsLoading(false);
        return Alert.alert("No Service", "Please add at least one service.");
      }

      if (!date || !time || !contact || !address) {
        setIsLoading(false);
        return Alert.alert(
          "Invalid Credentials",
          "Please fill all required fields."
        );
      }

      const payload = {
        clientName: clientName.trim(),
        email: email.trim(),
        phone: contact.trim(),
        address: address.trim(),
        note: extraNote.trim() || undefined,
        service: services.join(", "),
        date: date,
        time: time,
        status: "Pending",
      };

      if (editId) {
        await editReservation(editId, payload);
        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Updated customer ${customerDetails?.clientName}'s (${
            customerDetails?.clientEmail
          }) reservation scheduled on ${formatDate(
            customerDetails!.schedule.date
          )} at ${customerDetails!.schedule.time}.`,
          adminEmail,
        });
      } else {
        await addReservation(payload);
        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Added a new reservation request for customer ${
            customerDetails?.clientName
          }'s (${
            customerDetails?.clientEmail
          }) reservation scheduled on ${formatDate(
            customerDetails!.schedule.date
          )} at ${customerDetails!.schedule.time}.`,
          adminEmail,
        });
      }

      setIsLoading(false);
      setPopup(
        editId
          ? "Reservation edited successfully!"
          : "Reservation added successfully!"
      );
      await load();
      setModalVisible(false);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong."
      );
    }
  }

  function onDateChange(_: any, selectedDate?: Date) {
    setShowDatePicker(false);
    if (!selectedDate) return;

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    setDate(`${yyyy}-${mm}-${dd}`);
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function addServiceFromInput() {
    const i = serviceInput.trim();
    if (!i) return;
    setServices((s) => [...s, i]);
    setServiceInput("");
  }

  function removeService(id: number) {
    setServices((s) => s.filter((_, i) => i !== id));
  }

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
          <Ionicons name="book" size={23} color={"#790808"} />
          <Text style={styles.headerText}>MANAGE RESERVATIONS</Text>
        </View>

        <View
          style={[styles.cardNote, { paddingHorizontal: 5, width: "100%" }]}
        >
          <Ionicons name="alert-circle-outline" size={20} color="#790808" />
          <Text
            style={[styles.cardNoteText, { flex: 1, paddingHorizontal: 5 }]}
          >
            All reservations are seen here. Manage reservations here.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "space-evenly",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={[
              styles.primaryAction,
              {
                backgroundColor: "#087910ff",
                flexDirection: "row",
                gap: 10,
                flex: 1,
              },
            ]}
            onPress={() => {
              openAdd();
              setCustomerDetails({
                clientEmail: email,
                clientName: clientName,
                schedule: {
                  date: date,
                  time: time,
                },
              });
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color={"white"} />
            <Text style={styles.primaryActionText}>Add New Reservation</Text>
          </TouchableOpacity>

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
        scrollEventThrottle={16}
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            style={[styles.primaryAction, { flexDirection: "row", gap: 10 }]}
            onPress={() => router.push("/reservations/history")}
          >
            <Ionicons name="checkmark-done-outline" size={24} color={"white"} />
            <Text style={styles.primaryActionText}>View Done Reservations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryAction,
              { backgroundColor: "#d4a017", flexDirection: "row", gap: 10 },
            ]}
            onPress={() => router.push("/reservations/pending")}
          >
            <Ionicons name="alert-circle-outline" size={24} color={"white"} />
            <Text style={styles.primaryActionText}>Pending Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryAction,
              { backgroundColor: "#3a3a3aff", flexDirection: "row", gap: 10 },
            ]}
            onPress={() => router.push("/reservations/cancelled")}
          >
            <Ionicons name="close-circle-outline" size={24} color={"white"} />
            <Text style={styles.primaryActionText}>
              View Cancelled/Declined
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginTop: 22,
            fontSize: 18,
            fontWeight: "700",
            color: "#790808",
          }}
        >
          All Reservations
        </Text>

        {reservations.map((r) => (
          <View key={r._id} style={styles.reservationCard}>
            <View style={styles.cardRow}>
              <Ionicons name="person-circle" size={22} color={"#790808"} />
              <Text style={styles.cardName}>{r.clientName}</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="briefcase-outline" size={20} color={"#790808"} />
              <Text style={styles.cardValue}>{r.service.toUpperCase()}</Text>
            </View>
            <View style={styles.cardRow}>
              <Ionicons name="calendar-outline" size={20} color={"#790808"} />
              <Text style={styles.cardValue}>
                {formatDate(r.date)} -- {r.time}
              </Text>
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
              <Ionicons name="settings-outline" size={20} color={"#790808"} />
              <Text style={styles.cardValue}>
                Placed on: {formatDate(r.createdAt)} at{" "}
                {formatTime(r.createdAt)}
              </Text>
            </View>

            <View style={styles.cardStatusRow}>
              <Ionicons
                name="ellipse"
                size={12}
                color={
                  r.status === "Pending"
                    ? "#d4a017"
                    : r.status === "Confirmed"
                    ? "#008000"
                    : "#555"
                }
              />
              <Text style={styles.cardStatusText}>
                {r.status.toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              {r.status === "Confirmed" && (
                <TouchableOpacity
                  onPress={() => {
                    updateReservationStatus(r._id, "Cancelled");
                    load();
                  }}
                  style={{
                    backgroundColor: "#4a4a4aff",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 15 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  openEdit(r);
                  setCustomerDetails({
                    clientEmail: r.email,
                    clientName: r.clientName,
                    schedule: {
                      date: r.date,
                      time: r.time,
                    },
                  });
                }}
                style={{
                  backgroundColor: "#2b6cb0",
                  paddingVertical: 6,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 15 }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            {r.note ? (
              <View style={styles.cardNote}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#790808"
                />
                <Text style={styles.cardNoteText}>{r.note}</Text>
              </View>
            ) : null}
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
          </View>
        ))}

        {modalVisible && (
          <ReservationModal
            editId={editId}
            setModalVisible={setModalVisible}
            clientName={clientName}
            setClientName={setClientName}
            email={email}
            setEmail={setEmail}
            contact={contact}
            setContact={setContact}
            address={address}
            setAddress={setAddress}
            extraNote={extraNote}
            setExtraNote={setExtraNote}
            serviceInput={serviceInput}
            setServiceInput={setServiceInput}
            addServiceFromInput={addServiceFromInput}
            removeService={removeService}
            services={services}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            save={save}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            onDateChange={onDateChange}
          />
        )}

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
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "white",
                }}
              >
                No reservation available yet.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {popup && <Popup message={popup} onClose={() => setPopup("")} />}
    </View>
  );
};

export default Reservations;
