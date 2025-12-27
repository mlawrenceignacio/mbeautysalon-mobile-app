import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { useAuthStore } from "../store/auth.store";
import { saveToken } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginWithGoogle = async () => {
  const redirectUri = Linking.createURL("auth");
  const authUrl = `${API_URL}/auth/google?platform=mobile`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "success" && result.url) {
    const { queryParams } = Linking.parse(result.url);

    if (queryParams?.token) {
      await saveToken(queryParams.token as string);

      await useAuthStore.getState().hydrate();

      router.replace("/(tabs)/dashboard");
    }
  } else {
    Alert.alert("Google Login Failed", "Authentication was cancelled.");
  }
};
