import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
  addService,
  deleteService,
  editService,
  getServices,
} from "../services/data";

import Loading from "../components/Loading";
import DeleteModal from "../components/Modal";
import Popup from "../components/Popup";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const categories = ["All", ...new Set(services.map((s) => s.category))];
  const sortedServices = applySorting(services);
  const [popupMessage, setPopupMessage] = useState("");
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    }, []),
  );

  async function load() {
    setIsLoading(true);
    try {
      const result = await getServices();

      if (!result) {
        setIsLoading(false);
        return;
      }

      setServices(result?.services);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Services load failed: ", err?.res?.status);
      setIsLoading(false);
    }
  }

  function applySorting(list: any) {
    if (selectedCategory === "All") return list;

    return list.filter(
      (s: any) => s.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }

  function openEditModal(item: any) {
    setEditId(item._id);
    setCategory(item.category);
    setServiceName(item.service);
    setShowModal(true);
  }

  async function save() {
    setIsLoading(true);
    if (!adminId) {
      setIsLoading(false);
      return;
    }
    try {
      if (!category.trim() || !serviceName.trim()) {
        Alert.alert("Invalid Input", "All fields are required.");
        return;
      }

      if (editId) {
        await editService(editId, {
          category: category.trim(),
          service: serviceName.trim(),
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Updated the service "${serviceName} of the category ${category}."`,
          adminEmail,
        });

        setPopupMessage("Edited successfully!");
      } else {
        await addService({
          category: category.trim(),
          service: serviceName.trim(),
        });

        await addAdminActivity(adminId, {
          adminUsername,
          activityName: `Created a new service "${serviceName} under the category of ${category}."`,
          adminEmail,
        });
        setPopupMessage("Service added successfully!");
      }

      setIsLoading(false);
      setShowModal(false);
      load();
    } catch (err: any) {
      console.error(err?.res?.status);
      setIsLoading(false);
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
          <Ionicons name="cut-outline" size={30} color={"#700808"} />
          <Text style={styles.headerText}>MANAGE SERVICES</Text>
        </View>

        <View
          style={[styles.cardNote, { paddingHorizontal: 5, width: "100%" }]}
        >
          <Ionicons name="alert-circle-outline" size={20} color="#790808" />
          <Text
            style={[styles.cardNoteText, { flex: 1, paddingHorizontal: 5 }]}
          >
            All salon services are displayed here. Manage them by adding,
            updating, and deleting service from the service list.
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
              + Add New Service
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
        {sortedServices.map((s: any) => (
          <View
            key={s._id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: 15,
              marginTop: 15,
              borderRadius: 10,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700" }}>
              {s.service.toUpperCase()}
            </Text>
            <Text style={{ marginTop: 3 }}>Category: {s.category}</Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => openEditModal(s)}
                style={{
                  backgroundColor: "#004289ff",
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeleteId(s._id)}
                style={{
                  backgroundColor: "#8e0500ff",
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white" }}>Delete</Text>
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
                  contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
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
                    {editId ? "Edit Service" : "Add Service"}
                  </Text>

                  <TextInput
                    placeholder="Category (e.g. Hair)"
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
                    placeholder="Service Name (e.g. Rebond)"
                    value={serviceName}
                    onChangeText={setServiceName}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 12,
                    }}
                    placeholderTextColor="#616161"
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setShowModal(false)}
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

        {popupMessage && (
          <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
        )}

        {deleteId && (
          <DeleteModal
            message="Are you sure you want to delete this?"
            func1Text="Yes"
            func2Text="No"
            func1={async () => {
              setIsLoading(true);
              if (!adminId) {
                setIsLoading(false);
                return;
              }
              await deleteService(deleteId);
              await addAdminActivity(adminId, {
                adminUsername,
                activityName: `Deleted the service "${serviceName} of the category ${category}."`,
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

        {sortedServices.length === 0 && (
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
                No services found in this category.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Services;
