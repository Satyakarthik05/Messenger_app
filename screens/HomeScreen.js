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
import logo from "../assets/app_logo2.png";
import { Image } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setusers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={logo}
            style={{
              width: 30,
              height: 30,
              marginLeft: 2,
              borderRadius: 50,
              marginTop: 5,
            }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              marginLeft: 5,
              color: "purple",
            }}
          >
            Klicko
          </Text>
        </View>
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
            `https://klicko-backend.onrender.com/users/${userId}`
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
