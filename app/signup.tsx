import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
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
import { loginWithGoogle } from "./services/googleAuth";
import { useAuthStore } from "./store/auth.store";
import { styles } from "./styles/styles";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, loading } = useAuthStore();

  const handleSignup = async () => {
    if (!email || !password) {
      return Alert.alert(
        "Invalid Credentials",
        "Please enter email and password.",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return Alert.alert(
        "Invalid Email",
        "Please enter a valid email address.",
      );
    }

    if (password.length < 8) {
      return Alert.alert(
        "Invalid Password",
        "Password should be at least 8 characters.",
      );
    }

    const ok = await signup({ email: email.trim(), password });

    if (!ok) {
      const { error } = useAuthStore.getState();
      Alert.alert("Signup Failed", error ?? "Something went wrong.");
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
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              marginVertical: 30,
              color: "#790808",
            }}
          >
            Create an Account
          </Text>

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
              onSubmitEditing={handleSignup}
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
            <TouchableOpacity onPress={handleSignup} disabled={loading}>
              <Text style={styles.buttonText}>Sign Up</Text>
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
              <Text style={styles.textButton}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#2b6cb0" }}>
                Log in
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
