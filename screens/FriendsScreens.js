import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const FriendsScreens = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setfriendRequests] = useState([]);

  useEffect(() => {
    fetchfriendRequests();
  }, []);

  const fetchfriendRequests = async () => {
    try {
      const response = await axios.get(
        `https://klicko-backend.onrender.com/myrequests/${userId}`
      );
      if (response.status == 200) {
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        setfriendRequests(friendRequestsData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(friendRequests);
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 ? (
        <Text>Your Friend Requests</Text>
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <FontAwesome5
            name="user-friends"
            size={24}
            color="black"
            style={{ fontSize: 60 }}
          />
          <Text style={{ marginTop: 10, fontSize: 20 }}>
            No friend Requests available
          </Text>
        </View>
      )}

      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          setfriendRequests={setfriendRequests}
        />
      ))}
    </View>
  );
};

export default FriendsScreens;

const styles = StyleSheet.create({});
