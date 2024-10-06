import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [messages, setmessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://klicko-backend.onrender.com/messages/${userId}/${item._id}`
      );
      const data = await response.json();
      if (response.ok) {
        setmessages(data);
      } else {
        console.log("error", response.status.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const getlastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;
    return userMessages[n - 1];
  };
  const formatTime = (time) => {
    // Convert to milliseconds if the input is in seconds
    const milliseconds =
      typeof time === "number" && time < 1e12 ? time * 1000 : time;

    const date = new Date(milliseconds);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  };

  const lastMessage = getlastMessage();
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
      onPress={() =>
        navigation.navigate("Messages", {
          reciepentId: item._id,
        })
      }
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, reSizeMode: "cover" }}
        source={{
          uri: `https://klicko-backend.onrender.com/${item?.image.replace(
            /\\/g,
            "/"
          )}`,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: 500 }}>{item?.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: 500 }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
