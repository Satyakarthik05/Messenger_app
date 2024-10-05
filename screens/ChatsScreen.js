import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserType } from "../UserContext";
import UserChat from "../components/UserChat";
const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `http://192.168.128.105:4000/accepted-friends/${userId}`
        );

        // Await the response.json() to get the data
        const data = await response.json();

        if (response.ok) {
          setAcceptedFriends(data); // Update state with the fetched data
        } else {
          console.error("Failed to fetch accepted friends:", response.status);
        }
      } catch (error) {
        console.error("Error fetching accepted friends:", error);
      }
    };

    acceptedFriendsList();
  }, [userId]); // Make sure to include userId in the dependency array

  console.log("Friendss", acceptedFriends);
  return (
    <ScrollView>
      <Pressable showsVerticalScrollIndicator={false}>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
