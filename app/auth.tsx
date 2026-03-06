import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { saveToken } from "./services/storage";
import { useAuthStore } from "./store/auth.store";

export default function AuthRedirect() {
  useEffect(() => {
    const handle = async () => {
      const url = await Linking.getInitialURL();
      if (!url) return;

      const { queryParams } = Linking.parse(url);
      const token = queryParams?.token as string;

      if (!token) {
        router.replace("/login");
        return;
      }

      await saveToken(token);
      await useAuthStore.getState().hydrate();

      router.replace("/(tabs)/dashboard");
    };

    handle();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
