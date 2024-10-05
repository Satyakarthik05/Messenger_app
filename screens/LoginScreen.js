import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [invalidUser, setInvalidUser] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Home");
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://192.168.128.105:4000/user/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        Alert.alert("Login success", "user Login successfully");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error.response.data.message);
        Alert.alert("Login failed", "User not loged in");
        setInvalidUser(error.response.data.message);
      });
  };
  console.log(invalidUser);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: "10",
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: 600 }}>
            Sign In
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 600 }}>
            Sign In to your account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ color: "red", fontWeight: "600", fontSize: 10 }}>
              {invalidUser}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholder="Enter Your Email"
              placeholderTextColor={"black"}
              value={email}
              onChangeText={(text) => {
                setemail(text);
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              password
            </Text>
            <TextInput
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              secureTextEntry={true}
              placeholder="Enter Your Password"
              placeholderTextColor={"black"}
              value={password}
              onChangeText={(text) => {
                setpassword(text);
              }}
            />
          </View>

          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginRight: "auto",
              marginLeft: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Dont have an account? Sign up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
