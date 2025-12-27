import { isAxiosError } from "axios";
import { create } from "zustand";
import api from "../services/api";
import {
  login as loginRequest,
  signup as signupRequest,
} from "../services/auth";
import { deleteToken, getToken, saveToken } from "../services/storage";
import { AuthState } from "../types/types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  signup: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await signupRequest(data);

      await saveToken(res.token);

      set({
        user: res.user,
        token: res.token,
        loading: false,
      });

      return true;
    } catch (err) {
      set({
        error: isAxiosError(err)
          ? err.response?.data?.message || "Signup failed"
          : "Unexpected error",
        loading: false,
      });
      return false;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await loginRequest(data);

      await saveToken(res.token);

      set({
        user: res.user,
        token: res.token,
        loading: false,
      });

      return true;
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Unexpected error";

      set({ error: message, loading: false });
      return false;
    }
  },

  hydrate: async () => {
    console.log("HYDRATE START");
    set({ loading: true });

    const token = await getToken();
    console.log("HYDRATE TOKEN:", token);
    if (!token) {
      set({ loading: false });
      return;
    }

    set({ token });

    try {
      const res = await api.get("/user");

      console.log("HYDRATE USER:", res.data.user);

      set({ token, user: res.data.user, loading: false });
    } catch {
      console.log("HYDRATE FAILED");

      await deleteToken();
      set({ token: null, user: null, loading: false });
    }
  },

  logout: async () => {
    await deleteToken();

    set({ user: null, token: null, loading: false, error: null });
  },
}));
