import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import { updateUser } from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState("");

  const saveUsername = async () => {
    setIsLoading(true);
    try {
      if (!newUsername.trim()) {
        setIsLoading(false);
        setPopup("Username required!");
        return;
      }

      if (newUsername.length < 8) {
        setIsLoading(false);
        setPopup("Username must be at least 8 characters.");
        return;
      }

      if (newUsername.length > 12) {
        setIsLoading(false);
        setPopup("Maximum of 12 characters.");
        return;
      }

      const userId = user?._id || "";

      const updated = await updateUser(userId, {
        username: newUsername.trim(),
      });

      useAuthStore.getState().setUser(updated.updatedUser);

      setIsLoading(false);
      setPopup("Username saved!");
      setModalVisible(false);
    } catch (err: any) {
      console.error(err?.response?.status || err);
      setIsLoading(false);
      setPopup("Failed to save username.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Ionicons name="person" size={25} color={"#790808"} />
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#790808",
          }}
        >
          Profile
        </Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color="#790808" />
        </View>

        <Text style={styles.usernameText}>@{user?.username.toUpperCase()}</Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Ionicons name="mail-outline" size={18} color="#555" />
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20, width: "100%", gap: 12 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Edit Username</Text>
          <Ionicons name="chevron-forward" size={20} color={"#777"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/salon-data/activityHistory")}
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>Activity History</Text>
          <Ionicons name="chevron-forward" size={20} color={"#777"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.menuItem}>
          <Text style={[styles.menuText, { color: "#b30000" }]}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#b30000" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Edit Username
            </Text>

            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              style={{
                marginTop: 15,
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#ccc",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.buttonCont,
                  { backgroundColor: "#5c5c5cff", width: "45%" },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonCont,
                  { backgroundColor: "#790808", width: "45%" },
                ]}
                onPress={saveUsername}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {popup && <Popup message={popup} onClose={() => setPopup("")} />}
    </View>
  );
};

export default Profile;
