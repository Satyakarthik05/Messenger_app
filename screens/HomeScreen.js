import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
// import { userType } from "../UserContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../components/User";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setusers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "Bold" }}>Switch text</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Chats")}
          />
          <Ionicons
            name="people-outline"
            size={24}
            color="black"
            onPress={() => {
              navigation.navigate("Friends");
            }}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        try {
          const response = await axios.get(
            `http://192.168.128.105:4000/users/${userId}`
          );
          setusers(response.data);
        } catch (error) {
          console.log("Error retrieving users", error);
        }
      }
    };

    fetchUsers();
  }, []);
  console.log("users", users);
  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
