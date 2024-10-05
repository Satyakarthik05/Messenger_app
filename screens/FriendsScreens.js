import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreens = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setfriendRequests] = useState([]);

  useEffect(() => {
    fetchfriendRequests();
  }, []);

  const fetchfriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.128.105:4000/myrequests/${userId}`
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
      {friendRequests.length > 0 && <Text>Your Friend Requests</Text>}

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
