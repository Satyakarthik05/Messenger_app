import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { jwtDecode } from "jwt-decode"; // Remove the destructure since it's not an ES6 module
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../components/User";
import { UserType } from "../UserContext";
import logo from "../assets/app_logo2.jpg";
import { Image } from "react-native";
import { TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "No", // Cancel option
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes", // Confirm option
          onPress: async () => {
            try {
              // Remove token or any other relevant data from AsyncStorage
              await AsyncStorage.removeItem("authToken");
              console.log("Logged out successfully");

              navigation.navigate("Login");
            } catch (error) {
              console.error("Error removing auth token", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={logo}
            onPress={handleLogout} // Show alert on pressing the logo
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
          <View style={styles.search}>
            <View style={styles.searchBar}>
              <Icon name="search" size={20} color="#333" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Search user"
                value={searchQuery}
                onChangeText={(text) => handleSearch(text)} // Trigger search on input change
              />
            </View>
          </View>
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
  }, [searchQuery]); // Include searchQuery in the dependency array

  const handleSearch = (text) => {
    setSearchQuery(text); // Update the search query state
    fetchUsers(text); // Fetch users based on search query
  };

  const fetchUsers = async (query = "") => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      try {
        const response = await axios.get(
          `https://klicko-backend.onrender.com/users/${userId}`,
          {
            params: { search: query }, // Pass the search query as a parameter
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.log("Error retrieving users", error);
      } finally {
        setLoading(false); // Stop loading when the request completes
      }
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch all users initially
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Fetching users...</Text>
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 130, // Adjust the width as needed
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    width: 100,
    borderBlockColor: "white",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutButton: {
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
