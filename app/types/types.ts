export type User = {
  id: string;
  email: string;
  username: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  signup: (data: { email: string; password: string }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};
