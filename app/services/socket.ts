import io from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_API;

const socket = SOCKET_URL
  ? io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    })
  : null;

export default socket;
