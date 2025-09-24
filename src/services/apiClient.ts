// apiClient.ts
import axios from "axios";
import { Platform } from "react-native";

let baseURL = ""; 

if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:8080/royal"; // Android Emulator
} else if (Platform.OS === "ios") {
  baseURL = "http://localhost:8080/royal"; // iOS Simulator
} else {
  baseURL = "http://192.168.0.241:8080/royal"; // Physical device
}

const api = axios.create({
  baseURL, // 只到端口，不带 /rl
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;