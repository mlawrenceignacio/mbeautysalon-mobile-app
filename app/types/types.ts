export type User = {
  _id: string;
  email: string;
  username: string;
  role: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User) => void;

  signup: (data: { email: string; password: string }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};
