import React, { useState, useEffect, use } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const SERVER_IP = "10.0.0.156"; // Replace with your server's local IP
const SERVER_URL = `ws://${SERVER_IP}:3000`;

const ChatRoom = ({ userName }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const connectToWebSocket = async () => {
      const state = await NetInfo.fetch();
      console.log(state.type);
      if (state.type === "wifi") {
        const ws = new WebSocket(SERVER_URL);

        ws.onopen = () => console.log("Connected to WebSocket server");

        ws.onmessage = (event) => {
          setMessages((prev) => [
            ...prev,
            { user: userName, text: event.data, id: Date.now() },
          ]);
        };
        ws.onerror = (error) => console.error("WebSocket Error:", error);
        ws.onclose = () => console.log("Disconnected from WebSocket");

        setSocket(ws);
      } else {
        console.log("Not connected to Wi-Fi, WebSocket unavailable");
      }
    };

    connectToWebSocket();
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let timestamp = Date.now();
      const message = {
        text: inputMessage,
        user: userName,
        id: 0,
        timestamp: timestamp,
      };
      const toSend = JSON.stringify(message);
      socket.send(toSend);
      setMessages((prev) => [
        ...prev,
        { user: userName, text: inputMessage, id: timestamp },
      ]);
      setInputMessage("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>{item.text}</Text>
        )}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatRoom;
