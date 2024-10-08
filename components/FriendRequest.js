import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setfriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [disabled, setDisabled] = useState(false);

  const acceptRequest = async (friendRequestId) => {
    setDisabled(true);
    try {
      const response = await fetch(
        "https://klicko-backend.onrender.com/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            receipentId: userId,
          }),
        }
      );
      if (response.ok) {
        setfriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
        setDisabled(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{
          uri: `https://klicko-backend.onrender.com/${item?.image.replace(
            /\\/g,
            "/"
          )}`,
        }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request
      </Text>

      <Pressable
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
        onPress={() => acceptRequest(item._id)}
        disabled={disabled}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
