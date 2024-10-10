import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

const User = ({ item }) => {
  const { userId } = useContext(UserType);

  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [disabled, setDisabled] = useState(false); // Fix: change 'disable' to 'disabled'

  // Fetch sent friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `https://klicko-backend.onrender.com/friend-request/sent/${userId}`
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

  // Fetch user friends
  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `https://klicko-backend.onrender.com/friends/${userId}`
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

  // Send friend request
  const sendFriendRequest = async (currentUserId, selectUserId) => {
    if (disabled) return; // Prevent multiple presses

    setDisabled(true); // Disable button immediately on press

    const friendRequestData = {
      currentUserId: currentUserId,
      selectUserId: selectUserId,
    };

    try {
      const response = await axios.post(
        "https://klicko-backend.onrender.com/user/friendreq",
        friendRequestData
      );
      if (response.status === 200) {
        console.log("User request sent");
        setRequestSent(true); // Mark request as sent
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false); // Re-enable button after request completes
    }
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      {/* Display user image */}
      <View>
        <Image
          source={{
            uri: item?.image
              ? `https://klicko-backend.onrender.com/${item.image.replace(
                  /\\/g,
                  "/"
                )}`
              : "https://via.placeholder.com/50", // Fallback image if user has no DP
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

      {/* Conditional button rendering based on friend status */}
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
          disabled={true} // Fix: use 'disabled' instead of 'disable'
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
          disabled={disabled} // Disable button after sending request
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
