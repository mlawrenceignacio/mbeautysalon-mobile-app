import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dispatch, SetStateAction } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/styles";
import { formatDate } from "../utils/formatDate";

const AVAILABLE_TIMES = [
  "8:00 AM",
  "10:00 AM",
  "1:00 PM",
  "3:00 PM",
  "5:00 PM",
];

type Props = {
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
};

const input = {
  borderWidth: 1,
  borderColor: "#d1d5db",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 12,
  marginBottom: 12,
  backgroundColor: "#fff",
} as const;

export default function ReservationModal({
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
  time,
  setTime,
  save,
  showDatePicker,
  setShowDatePicker,
  onDateChange,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingHorizontal: 8,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              maxHeight: "75%",
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#790808",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {editId ? "Edit Reservation" : "Add Reservation"}
              </Text>

              <TextInput
                placeholder="Client Name *"
                value={clientName}
                onChangeText={setClientName}
                placeholderTextColor="#616161"
                style={input}
              />

              <TextInput
                placeholder="Email *"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#616161"
                style={input}
              />

              <TextInput
                placeholder="Contact Number *"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
                placeholderTextColor="#616161"
                style={input}
              />

              <TextInput
                placeholder="Address *"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="#616161"
                style={input}
              />

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                <TextInput
                  placeholder="Add Service *"
                  value={serviceInput}
                  onChangeText={setServiceInput}
                  placeholderTextColor="#616161"
                  style={[input, { flex: 1, marginBottom: 0 }]}
                />
                <TouchableOpacity
                  onPress={addServiceFromInput}
                  style={{
                    backgroundColor: "#790808",
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>Add</Text>
                </TouchableOpacity>
              </View>

              {services.length > 0 && (
                <View style={{ marginBottom: 12, gap: 8 }}>
                  {services.map((service, index) => (
                    <View
                      key={`${service}-${index}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#fff4f7",
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text style={{ flex: 1, color: "#333" }}>{service}</Text>
                      <TouchableOpacity onPress={() => removeService(index)}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#b91c1c"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: date ? "#000" : "#999" }}>
                  {date ? formatDate(date) : "Select Date *"}
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

              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontWeight: "700",
                    color: "#790808",
                    marginBottom: 8,
                  }}
                >
                  Select Time *
                </Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {AVAILABLE_TIMES.map((t) => {
                    const active = time === t;

                    return (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setTime(t)}
                        style={{
                          backgroundColor: active ? "#790808" : "#fff",
                          borderWidth: 1,
                          borderColor: "#790808",
                          borderRadius: 999,
                          paddingVertical: 8,
                          paddingHorizontal: 14,
                        }}
                      >
                        <Text style={{ color: active ? "#fff" : "#790808" }}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TextInput
                placeholder="Extra Note (optional)"
                value={extraNote}
                onChangeText={setExtraNote}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#616161"
                style={[input, { minHeight: 45, maxHeight: 100 }]}
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[
                    styles.primaryAction,
                    { flex: 1, backgroundColor: "#6b7280" },
                  ]}
                >
                  <Text style={styles.primaryActionText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={save}
                  style={[
                    styles.primaryAction,
                    { flex: 1, backgroundColor: "#087910" },
                  ]}
                >
                  <Text style={styles.primaryActionText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
