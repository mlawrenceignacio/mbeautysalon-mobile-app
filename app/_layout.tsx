import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { hasApiConfig } from "./services/api";
import { useAuthStore } from "./store/auth.store";

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    const setupSystemUi = async () => {
      await SystemUI.setBackgroundColorAsync("#ffffff");

      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync("#ffffff");
        await NavigationBar.setButtonStyleAsync("dark");
      }
    };

    setupSystemUi();

    if (hasApiConfig) {
      hydrate();
    }
  }, [hydrate]);

  if (!hasApiConfig) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
              backgroundColor: "#ffffff",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Missing app configuration. Check EAS environment variables.
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        edges={["top"]}
      >
        <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#ffffff" },
              animation: "default",
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
