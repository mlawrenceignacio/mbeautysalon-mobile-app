import io from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_SOCKET_API!, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

export default socket;
