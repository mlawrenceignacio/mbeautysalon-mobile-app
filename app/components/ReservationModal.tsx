import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";

const AVAILABLE_TIMES = [
  "8:00 AM",
  "10:00 AM",
  "1:00 PM",
  "3:00 PM",
  "5:00 PM",
];

const ReservationModal = ({
  editId,
  setModalVisible,
  clientName,
  setClientName,
  email,
  setEmail,
  contact,
  setContact,
  address,
  setAddress,
  extraNote,
  setExtraNote,
  serviceInput,
  setServiceInput,
  addServiceFromInput,
  removeService,
  services,
  date,
  setDate,
  time,
  setTime,
  save,
  showDatePicker,
  setShowDatePicker,
  onDateChange,
}: {
  editId: any;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  clientName: string;
  setClientName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  contact: string;
  setContact: Dispatch<SetStateAction<string>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  extraNote: string;
  setExtraNote: Dispatch<SetStateAction<string>>;
  serviceInput: string;
  setServiceInput: Dispatch<SetStateAction<string>>;
  addServiceFromInput: () => void;
  removeService: (index: number) => void;
  services: string[];
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  time: string;
  setTime: Dispatch<SetStateAction<string>>;
  save: () => void;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<SetStateAction<boolean>>;
  onDateChange: (event: any, date?: Date) => void;
}) => {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  return (
    <Modal transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
            maxHeight: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#790808" }}>
              {editId ? "Edit Reservation" : "Add Reservation"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ marginTop: 12 }}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <TextInput
              placeholder="Client Name *"
              value={clientName}
              onChangeText={setClientName}
              style={[
                styles.inputField,
                { marginBottom: 10, backgroundColor: "#ebebebff" },
              ]}
              placeholderTextColor={"#616161ff"}
            />
            <TextInput
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={[
                styles.inputField,
                { marginBottom: 10, backgroundColor: "#ebebebff" },
              ]}
              placeholderTextColor={"#616161ff"}
            />
            <TextInput
              placeholder="Contact Number *"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              style={[
                styles.inputField,
                { marginBottom: 10, backgroundColor: "#ebebebff" },
              ]}
              placeholderTextColor={"#616161ff"}
            />
            <TextInput
              placeholder="Address *"
              value={address}
              onChangeText={setAddress}
              style={[
                styles.inputField,
                { marginBottom: 10, backgroundColor: "#ebebebff" },
              ]}
              placeholderTextColor={"#616161ff"}
            />
            <TextInput
              placeholder="Extra note (optional)"
              value={extraNote}
              onChangeText={setExtraNote}
              multiline
              style={[
                styles.inputField,
                {
                  marginBottom: 10,
                  backgroundColor: "#ebebebff",
                  maxHeight: 150,
                  minHeight: 20,
                },
              ]}
              placeholderTextColor={"#616161ff"}
            />

            <Text style={{ marginBottom: 8, fontWeight: "700" }}>
              Services *
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: 10,
                backgroundColor: "#ebebebff",
                borderRadius: 10,
              }}
            >
              <TextInput
                placeholder="e.g. Manicure"
                value={serviceInput}
                onChangeText={setServiceInput}
                style={[styles.inputField, { flex: 1 }]}
                placeholderTextColor={"#616161ff"}
              />
              <TouchableOpacity
                onPress={addServiceFromInput}
                style={{
                  backgroundColor: "#790808",
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {services.map((s, i) => (
                <View
                  key={`${s}-${i}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: "#f1f1f1",
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ marginRight: 8 }}>{s}</Text>
                  <TouchableOpacity onPress={() => removeService(i)}>
                    <Ionicons name="close-circle" size={18} color="#8c0e09ff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.inputCont}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={[styles.inputField, { color: date ? "#000" : "#999" }]}
              >
                {!date ? "Select Date *" : formatDate(date)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity
              style={styles.inputCont}
              onPress={() => setShowTimeDropdown((v) => !v)}
            >
              <Text
                style={[styles.inputField, { color: time ? "#000" : "#999" }]}
              >
                {time || "Select Time *"}
              </Text>
            </TouchableOpacity>

            {showTimeDropdown && (
              <View
                style={{
                  backgroundColor: "#f1f1f1",
                  borderRadius: 10,
                  marginTop: 6,
                }}
              >
                {AVAILABLE_TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => {
                      setTime(t);
                      setShowTimeDropdown(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: 1,
                      borderColor: "#ddd",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                onPress={async () => {
                  await save();
                }}
                style={[styles.primaryAction, { flex: 1, marginRight: 8 }]}
              >
                <Text style={styles.primaryActionText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.primaryAction,
                  { backgroundColor: "#383838ff", flex: 1 },
                ]}
              >
                <Text style={styles.primaryActionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ReservationModal;
