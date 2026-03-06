import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";

const ManageData = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: "#790808",
          marginBottom: 25,
          textAlign: "center",
        }}
      >
        Manage Salon Data
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("./faq")}
        >
          <Ionicons name="help-circle-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("./services")}
        >
          <Ionicons name="cut-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("./reservations")}
        >
          <Ionicons name="book-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage Reservations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("./contact")}
        >
          <Ionicons name="call-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage Contact Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("./promotions")}
        >
          <Ionicons name="star-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage Promotions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ManageData;
