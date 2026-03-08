import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
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
import {
  addAdminActivity,
  addPromotion,
  getAllPromotions,
  updatePromotion,
} from "../services/data";
import { styles } from "../styles/styles";

import Loading from "../components/Loading";
import Popup from "../components/Popup";
import { useAuthStore } from "../store/auth.store";
import { formatDate } from "../utils/formatDate";

const Promotions = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [promotionName, setPromotionName] = useState("");
  const [description, setDescription] = useState("");
  const [expiration, setExpiration] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [popup, setPopup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView | null>(null);
  const categories = ["All", ...new Set(promotions.map((s) => s.category))];
  const sortedPromotions = applySorting(promotions);

  const { user } = useAuthStore();
  const adminId = user?._id;
  const adminUsername = user?.username;
  const adminEmail = user?.email;

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {};
    }, []),
  );

  async function load() {
    setIsLoading(true);
    try {
      const result = await getAllPromotions();

      if (!result) {
        setIsLoading(false);
        return;
      }

      setPromotions(result?.promotions);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Promotions load failed: ", err?.res?.status);
      setIsLoading(false);
    }
  }

  function applySorting(list: any) {
    if (selectedCategory === "All") return list;

    return list.filter(
      (p: any) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }

  function openEditModal(item: any) {
    setEditId(item._id);
    setCategory(item.category);
    setPromotionName(item.name);
    setDescription(item.description);
    setExpiration(item.expiration);
    setShowModal(true);
  }

  async function save() {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      if (
        !category.trim() ||
        !promotionName.trim() ||
        !description.trim() ||
        !expiration?.trim()
      ) {
        return Alert.alert("Invalid Input", "All fields are required.");
      }

      if (editId) {
        await updatePromotion(editId, {
          name: promotionName.trim(),
          category: category.trim(),
          description: description.trim(),
          expiration,
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Updated the promotion ${promotionName.trim()} of the category ${category.trim()}`,
          adminEmail,
        });
        setPopup("Edited successfully!");
      } else {
        await addPromotion({
          name: promotionName.trim(),
          category: category.trim(),
          description: description.trim(),
          expiration,
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Added the new promotion "${promotionName.trim()}" under the category of ${category.trim()}`,
          adminEmail,
        });
        setPopup("Promotion added successfully!");
      }

      setIsLoading(false);
      setShowModal(false);
      load();
    } catch (err: any) {
      console.error(err?.res?.status);
      setIsLoading(false);
    }
  }

  function onDateChange(_: any, selectedDate?: Date) {
    setShowDatePicker(false);
    if (!selectedDate) return;

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    setExpiration(`${yyyy}-${mm}-${dd}`);
  }

  if (isLoading) return <Loading />;

  function scrollToTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
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
          <Ionicons name="star-outline" size={30} color={"#700808"} />
          <Text style={styles.headerText}>MANAGE PROMOTIONS</Text>
        </View>

        <View
          style={[styles.cardNote, { paddingHorizontal: 5, width: "100%" }]}
        >
          <Ionicons name="alert-circle-outline" size={20} color="#790808" />
          <Text
            style={[styles.cardNoteText, { flex: 1, paddingHorizontal: 5 }]}
          >
            All salon promotions are displayed here. Manage them by adding,
            updating, and deleting service from the promotion list.
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => setDropdownOpen(!dropdownOpen)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>Sort: {selectedCategory}</Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View
              style={{
                marginTop: 5,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                overflow: "hidden",
              }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
            onPress={() => setShowModal(true)}
            style={[
              styles.primaryAction,
              {
                backgroundColor: "#790808",
                flexDirection: "row",
                gap: 10,
                flex: 1,
              },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              + Add New Promotion
            </Text>
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
        {sortedPromotions.map((p: any) => (
          <View
            key={p._id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: 15,
              marginTop: 15,
              borderRadius: 10,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>
              {p.name.toUpperCase()}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 10,
                paddingHorizontal: 10,
              }}
            >
              <Ionicons name="star-outline" size={18} color={"#790808"} />
              <Text style={{ flex: 1 }}>Category: {p.category}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 5,
                backgroundColor: "#ffe8e8ff",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={"#790808"}
              />
              <Text style={{ flex: 1 }}>Description: {p.description}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 5,
                paddingHorizontal: 10,
              }}
            >
              <Ionicons
                name={p.status === "Active" ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={"#790808"}
              />
              <Text>Status: {p.status}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 5,
                paddingHorizontal: 10,
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={"#790808"}
              />
              <Text style={{ flex: 1 }}>
                Expiration: {formatDate(p.expiration)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => openEditModal(p)}
                style={{
                  backgroundColor: "#004289ff",
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setShowModal(false)}
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
                justifyContent: "center",
                paddingHorizontal: 8,
                paddingTop: 8,
                paddingBottom: Math.max(insets.bottom, 8),
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="interactive"
                  contentContainerStyle={{ padding: 16, paddingBottom: 16 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      marginBottom: 15,
                      color: "#790808",
                    }}
                  >
                    {editId ? "Edit Promotion" : "Add Promotion"}
                  </Text>

                  <TextInput
                    placeholder="Category * (e.g., Hair)"
                    value={category}
                    onChangeText={setCategory}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
                    placeholderTextColor="#616161"
                  />

                  <TextInput
                    placeholder="Promotion Name * (e.g., 25% February Off)"
                    value={promotionName}
                    onChangeText={setPromotionName}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
                    placeholderTextColor="#616161"
                  />

                  <TextInput
                    placeholder="Description *"
                    value={description}
                    onChangeText={setDescription}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                      minHeight: 120,
                      textAlignVertical: "top",
                    }}
                    multiline
                    placeholderTextColor="#616161"
                  />

                  <TouchableOpacity
                    style={styles.inputCont}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.inputField,
                        { color: expiration ? "#000" : "#999" },
                      ]}
                    >
                      {!expiration
                        ? "Select Expiration *"
                        : formatDate(expiration)}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={expiration ? new Date(expiration) : new Date()}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={onDateChange}
                    />
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                        setEditId(null);
                        setCategory("");
                        setDescription("");
                        setPromotionName("");
                        setExpiration("");
                      }}
                      style={[
                        styles.primaryAction,
                        { flex: 1, paddingVertical: 10 },
                      ]}
                    >
                      <Text style={styles.primaryActionText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={save}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#006900ff",
                        shadowColor: "#000",
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 5,
                      }}
                    >
                      <Text style={styles.primaryActionText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {popup && <Popup message={popup} onClose={() => setPopup("")} />}

        {sortedPromotions.length === 0 && (
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
                No promotions found in this category.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Promotions;
