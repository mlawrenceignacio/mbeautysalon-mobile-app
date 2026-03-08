import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "./components/Loading";
import Logo from "./components/Logo";
import { loginWithGoogle } from "./services/googleAuth";
import { useAuthStore } from "./store/auth.store";
import { styles } from "./styles/styles";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Invalid Credentials", "Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters.",
      );

      return;
    }

    const ok = await login({ email: email.trim(), password });

    if (!ok) {
      const { error } = useAuthStore.getState();
      Alert.alert("Login Failed", error ?? "Something wen wrong");
      return;
    }

    router.replace("/(tabs)/dashboard");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Logo />

          <View style={styles.inputCont}>
            <Image
              source={require("../assets/images/user.png")}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.inputField, { flex: 1 }]}
              placeholderTextColor="#616161"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputCont}>
            <Image
              source={require("../assets/images/lock.png")}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={[styles.inputField, { flex: 1 }]}
              placeholderTextColor="#616161"
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={{ paddingHorizontal: 0 }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#790808"
              />
            </Pressable>
          </View>

          <View style={[{ backgroundColor: "#790808" }, styles.buttonCont]}>
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={[{ backgroundColor: "#FED3DD" }, styles.buttonCont]}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => loginWithGoogle()}
            >
              <Image
                source={require("../assets/images/google.png")}
                style={{ width: 15, height: 15 }}
              />
              <Text style={styles.textButton}>Log in with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text>
              Don{"'"}t have an account?{" "}
              <Link href="/signup" style={{ color: "#2b6cb0" }}>
                Sign up.
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
