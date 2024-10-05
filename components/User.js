import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

const User = ({ item }) => {
  const { userId } = useContext(UserType);

  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.128.105:4000/friend-request/sent/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("Error retrieving friend requests");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequests();
  }, [userId]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.128.105:4000/friends/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserFriends(data); // Correctly set the state
        } else {
          console.log("Error retrieving user friends");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFriends(); // Call the function here
  }, [userId]);

  const sendFriendRequest = async (currentUserId, selectUserId) => {
    const fri = {
      currentUserId: currentUserId,
      selectUserId: selectUserId,
    };

    try {
      const response = await axios.post(
        "http://192.168.128.105:4000/user/friendreq",
        fri
      );
      if (response.status === 200) {
        // Check for successful response
        console.log("User request sent");
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          source={{
            uri: `http://192.168.128.105:4000/${item?.image.replace(
              /\\/g,
              "/"
            )}`,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 5, color: "gray" }}>{item?.email}</Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
