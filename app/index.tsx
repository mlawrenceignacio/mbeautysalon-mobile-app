import { Redirect } from "expo-router";
import Loading from "./components/Loading";
import LoginScreen from "./login";
import { useAuthStore } from "./store/auth.store";

export default function Index() {
  const { token, loading } = useAuthStore();

  if (loading) return <Loading />;

  if (token) return <Redirect href={"/(tabs)/dashboard"} />;

  return <LoginScreen />;
}
