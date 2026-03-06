import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import {
  addAdminActivity,
  addContactInfo,
  deleteContactInfo,
  getContactInfos,
  updateContactInfo,
} from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";

const CONTACT_TYPES = [
  { key: "instagram", icon: "logo-instagram" },
  { key: "facebook", icon: "logo-facebook" },
  { key: "phone", icon: "call-outline" },
  { key: "email", icon: "mail-outline" },
  { key: "address", icon: "location-outline" },
];

type ContactMap = {
  [key: string]: {
    _id?: string;
    value: string;
  };
};

const ContactInfo = () => {
  const [contacts, setContacts] = useState<ContactMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const { user } = useAuthStore();
  const adminId = user?._id;
  const adminUsername = user?.username;
  const adminEmail = user?.email;

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    setIsLoading(true);
    try {
      const res = await getContactInfos();
      const mapped: ContactMap = {};

      CONTACT_TYPES.forEach(({ key }) => {
        mapped[key] = { value: "" };
      });

      res?.contacts?.forEach((c: any) => {
        mapped[c.contactName] = {
          _id: c._id,
          value: c.value,
        };
      });

      setContacts(mapped);
      setIsLoading(false);
    } catch (err) {
      console.error("Contacts load failed");
      setIsLoading(false);
    }
  }

  async function save(type: string) {
    setIsLoading(true);
    const entry = contacts[type];
    if (!entry.value.trim()) {
      return Alert.alert("Invalid Input", "Value cannot be empty.");
    }
    if (!adminId) {
      setIsLoading(false);
      return;
    }

    try {
      if (entry._id) {
        await updateContactInfo(entry._id, {
          contactName: type,
          value: entry.value.trim(),
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Updated the ${type} information.`,
          adminEmail,
        });
        setPopup("Contact updated successfully!");
      } else {
        await addContactInfo({
          name: type,
          val: entry.value.trim(),
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Added the ${type} information.`,
          adminEmail,
        });
        setPopup("Contact added successfully!");
      }
      setIsLoading(false);
      load();
    } catch {
      Alert.alert("Error", "Error saving contact.");
      setIsLoading(false);
    }
  }

  async function clear(type: string) {
    const entry = contacts[type];
    if (!entry?._id) return;

    Alert.alert("Clear Contact", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          if (!adminId) {
            setIsLoading(false);
            return;
          }
          await deleteContactInfo(entry._id!);

          await addAdminActivity(adminId, {
            adminUsername,
            activityName: `Cleared the ${type} information.`,
            adminEmail,
          });

          setIsLoading(false);
          setPopup("Contact cleared!");
          load();
        },
      },
    ]);
  }

  if (isLoading) return <Loading />;

  function scrollToTop() {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
    >
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View style={styles.headerCont}>
          <Ionicons name="call-outline" size={30} color="#790808" />
          <Text style={styles.headerText}>MANAGE CONTACT INFO</Text>
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
              Manage the Salon{"'"}s contact information here.
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
          padding: 20,
          paddingBottom: 50,
          paddingTop: 0,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {CONTACT_TYPES.map(({ key, icon }) => (
          <View
            key={key}
            style={{
              marginTop: 24,
              padding: 18,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                gap: 8,
              }}
            >
              <Ionicons name={icon as any} size={20} color="#790808" />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {key}
              </Text>
            </View>

            <TextInput
              value={contacts[key]?.value || ""}
              onChangeText={(text) =>
                setContacts((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], value: text },
                }))
              }
              placeholder={`Enter ${key}`}
              placeholderTextColor="#888"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 12,
                fontSize: 16,
                textAlign: "center",
                backgroundColor: "#fff",
              }}
            />

            <View
              style={{
                marginTop: 20,
                gap: 12,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => save(key)}
                style={{
                  backgroundColor: "#790808",
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  borderRadius: 12,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!contacts[key]?._id}
                onPress={() => clear(key)}
                style={{
                  backgroundColor: contacts[key]?._id ? "#d9534f" : "#aaa",
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  borderRadius: 12,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {popup && <Popup message={popup} onClose={() => setPopup(null)} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ContactInfo;
