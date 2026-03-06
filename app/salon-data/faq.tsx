import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import DeleteModal from "../components/Modal";
import Popup from "../components/Popup";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import {
  addAdminActivity,
  addFAQ,
  deleteFAQ,
  editFAQ,
  getFAQs,
} from "../services/data";

const Faq = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const { user } = useAuthStore();
  const adminId = user?._id;
  const adminUsername = user?.username;
  const adminEmail = user?.email;

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, [])
  );

  async function load() {
    setIsLoading(true);
    try {
      const result = await getFAQs();

      if (!result) {
        setIsLoading(false);
        return;
      }

      setFaqs(result?.faq);
      setIsLoading(false);
    } catch (err: any) {
      console.error("FAQ load failed: ", err?.res?.status);
      setIsLoading(false);
    }
  }

  function openEditModal(item: any) {
    setEditId(item._id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setShowModal(true);
  }

  async function save() {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      if (!question.trim() || !answer.trim()) {
        return Alert.alert("Invalid Input", "All fields are required.");
      }

      if (editId) {
        await editFAQ(editId, { question, answer });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Updted a FAQ with the question "${question}"`,
          adminEmail,
        });
        setPopupMessage("Update saved!");
      } else {
        await addFAQ({ question, answer });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Created a new FAQ with the question "${question}"`,
          adminEmail,
        });
        setPopupMessage("FAQ Added!");
      }

      setIsLoading(false);
      load();
      setShowModal(false);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert("Error saving FAQ.");
      console.error("Error saving FAQ.", err?.res?.status);
      setShowModal(false);
    }
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
          <Ionicons name="help-circle-outline" size={32} color="#790808" />
          <Text style={styles.headerText}>Manage FAQ</Text>
        </View>

        <View
          style={[styles.cardNote, { paddingHorizontal: 5, width: "100%" }]}
        >
          <Ionicons name="alert-circle-outline" size={20} color="#790808" />
          <Text
            style={[styles.cardNoteText, { flex: 1, paddingHorizontal: 5 }]}
          >
            All FAQs are displayed here. You can manage them by adding,
            updating, or deleting FAQ.
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
                backgroundColor: "#790808",
                flexDirection: "row",
                gap: 10,
                flex: 1,
              },
            ]}
            onPress={() => {
              setEditId(null);
              setQuestion("");
              setAnswer("");
              setShowModal(true);
            }}
          >
            <Ionicons name="add-outline" size={26} color={"white"} />
            <Text style={styles.primaryActionText}>Add New FAQ</Text>
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
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
      >
        {faqs.map((f) => (
          <View
            key={f._id}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 15,
              borderWidth: 1,
              borderColor: "#ddd",
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 5 }}>
              {f.question}
            </Text>

            <Text style={{ color: "#444", marginBottom: 15 }}>{f.answer}</Text>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#043468ff",
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  marginRight: 10,
                }}
                onPress={() => openEditModal(f)}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#8c0e09ff",
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setDeleteId(f._id);
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal visible={showModal} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 15,
                  color: "#790808",
                }}
              >
                {editId ? "Update FAQ" : "Add FAQ"}
              </Text>

              <TextInput
                placeholder="Question"
                value={question}
                onChangeText={setQuestion}
                style={[styles.inputField, { borderWidth: 1 }]}
                placeholderTextColor={"#616161ff"}
              />

              <TextInput
                placeholder="Answer"
                value={answer}
                onChangeText={setAnswer}
                style={[
                  styles.inputField,
                  {
                    borderWidth: 1,
                    borderColor: "black",
                    maxHeight: 150,
                    minHeight: 20,
                  },
                ]}
                multiline
                placeholderTextColor={"#616161ff"}
              />

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[
                    styles.primaryAction,
                    { flex: 1, marginRight: 10, paddingVertical: 12 },
                  ]}
                  onPress={save}
                >
                  <Text style={styles.primaryActionText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryAction,
                    {
                      flex: 1,
                      backgroundColor: "#383838ff",
                      paddingVertical: 12,
                    },
                  ]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.primaryActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {popupMessage && (
          <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
        )}

        {deleteId && (
          <DeleteModal
            message="Are you sure you want to delete this?"
            func1Text="Yes"
            func2Text="Cancel"
            func1={async () => {
              setIsLoading(true);
              if (!adminId) {
                setIsLoading(false);
                return;
              }
              await deleteFAQ(deleteId);
              await addAdminActivity(adminId, {
                adminUsername,
                activityName: `Deleted the FAQ "${question}"`,
                adminEmail,
              });
              setIsLoading(false);
              setPopupMessage("Deleted successfully!");
              setDeleteId(null);
              load();
            }}
            func2={() => setDeleteId(null)}
          />
        )}

        {faqs.length === 0 && (
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
                Add one to get started.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Faq;
