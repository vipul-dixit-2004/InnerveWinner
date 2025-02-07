import NetInfo from "@react-native-community/netinfo";

// Function to check if connected to local network
const isLocalNetworkConnected = async () => {
  const state = await NetInfo.fetch();
  return state.type === "wifi"; // Checks if connected to Wi-Fi
};
