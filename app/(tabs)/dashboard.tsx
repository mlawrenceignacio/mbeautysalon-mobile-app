import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/auth.store";

const Dashboard = () => {
  const { logout } = useAuthStore();

  return (
    <View>
      <Text>dashboard</Text>
      <Text>dashboard</Text>
      <Text>dashboard</Text>
      <Text>dashboard</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
