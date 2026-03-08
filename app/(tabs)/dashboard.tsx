import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Loading from "../components/Loading";
import { getReservations, getUsers } from "../services/data";
import { useAuthStore } from "../store/auth.store";
import { styles } from "../styles/styles";

const Dashboard = () => {
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  async function load() {
    setIsLoading(true);
    try {
      const webUsers = await getUsers();
      const allReservations = await getReservations();

      if (!webUsers?.users || !allReservations?.reservations) return;

      const reservations = allReservations.reservations;

      setUserCount(webUsers.users.length);
      setReservationCount(reservations.length);

      setConfirmedCount(
        reservations.filter((r: any) => r.status === "Confirmed").length,
      );
      setPendingCount(
        reservations.filter((r: any) => r.status === "Pending").length,
      );
      setCancelledCount(
        reservations.filter((r: any) => r.status === "Cancelled").length,
      );
      setDeclinedCount(
        reservations.filter((r: any) => r.status === "Declined").length,
      );
      setDoneCount(reservations.filter((r: any) => r.status === "Done").length);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Dashboard load failed:", err?.response?.status);
      setIsLoading(false);
      return;
    }
  }

  useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(() => {
      const now = new Date();

      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setCurrentDate(
        `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
      );
    }, 1000);

    setIsLoading(false);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    load();
    const refresh = setInterval(load, 240000);
    return () => clearInterval(refresh);
  }, []);

  const chartData = [
    {
      value: userCount,
      label: "Users",
      frontColor: "#790808",
    },
    { value: reservationCount, label: "Reservations", frontColor: "#2b6cb0" },
    { value: confirmedCount, label: "Confirmed", frontColor: "#008000" },
    { value: pendingCount, label: "Pending", frontColor: "#e34b0aff" },
    { value: cancelledCount, label: "Cancelled", frontColor: "#bf0043ff" },
    { value: declinedCount, label: "Declined", frontColor: "#51001cff" },
    { value: doneCount, label: "Done", frontColor: "#6e6e6eff" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20, paddingTop: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#ad0000ff", "#710000ff"]}
        style={styles.modernHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Welcome back, </Text>
          <Text style={[styles.headerUsername, { flex: 1 }]}>
            @{user?.username?.toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://mbeautysalon.vercel.app")}
        >
          <Ionicons name="globe-outline" size={28} color={"white"} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.infoRow}>
        <LinearGradient
          colors={["#ff166cff", "#ff69b4ff"]}
          style={[styles.infoCard, { height: "100%" }]}
        >
          <Text style={styles.infoNumber}>{userCount}</Text>
          <Text style={styles.infoLabel}>Web Users</Text>
        </LinearGradient>

        <View style={styles.timeCard}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.datePill}>{currentDate}</Text>
        </View>
      </View>

      <View style={[styles.chartCard, { overflow: "hidden" }]}>
        <Text style={styles.chartCardTitle}>Salon Overview</Text>

        <BarChart
          data={chartData}
          barWidth={45}
          spacing={45}
          noOfSections={5}
          barBorderRadius={6}
          xAxisThickness={0}
          yAxisThickness={0}
        />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionGridNew}>
        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("/reservations/pending")}
        >
          <Ionicons name="hourglass-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Reservation Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBox}
          onPress={() => router.push("/salon-data/manageData")}
        >
          <Ionicons name="settings-outline" size={32} color="#790808" />
          <Text style={styles.actionText}>Manage Salon Data</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 5 }}>
        <TouchableOpacity
          style={[styles.primaryAction, { gap: 10 }]}
          onPress={() => router.push("/reservations/userConfirmed")}
        >
          <Ionicons name="person-circle-outline" size={30} color="white" />
          <Text style={styles.primaryActionText}>User Confirmed Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryAction, { gap: 10 }]}
          onPress={() => router.push("/reservations/confirmed")}
        >
          <Ionicons name="calendar-outline" size={30} color="white" />
          <Text style={styles.primaryActionText}>Confirmed Reservations</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
