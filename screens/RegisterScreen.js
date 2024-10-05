import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { KeyboardAvoidingView, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const selectProfilePhoto = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "Please grant camera roll permissions."
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePhoto(pickerResult.assets[0].uri);
    }
  };

  const openCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Please grant camera permissions.");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePhoto(pickerResult.assets[0].uri);
    }
  };

  const convertUriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const handleRegister = async () => {
    try {
      const user = {
        name: name,
        email: email,
        password: password,
      };

      const formData = new FormData();
      const imageBlob = await convertUriToBlob(profilePhoto);
      formData.append("image", imageBlob, "profile.jpg"); // Add the image file to the form data

      for (const key in user) {
        formData.append(key, user[key]); // Append other user data
      }

      const response = await axios.post(
        "http://192.168.128.105:4000/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered successfully. Login now."
      );
      setName("");
      setEmail("");
      setPassword("");
      setProfilePhoto(null);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Registration failed", "Registration was unsuccessful");
      console.error("Registration failed", err);
    }
  };

  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
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
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600" }}>
            Register to your account
          </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 30 }}>
          <View style={styles.profileContainer}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profilePhoto}
              />
            ) : (
              <Image
                source={require("../assets/favicon.png")}
                style={styles.profilePhoto}
              />
            )}
            <TouchableOpacity style={styles.cameraIcon} onPress={openCamera}>
              <Icon name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <Button title="Select Profile Photo" onPress={selectProfilePhoto} />
        </View>

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
            Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor={"black"}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "gray",
              marginTop: 10,
            }}
          >
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor={"black"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "gray",
              marginTop: 10,
            }}
          >
            Password
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Enter Your Password"
            placeholderTextColor={"black"}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  profileContainer: {
    position: "relative",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#ddd",
    borderWidth: 2,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4A55A2",
    padding: 10,
    borderRadius: 25,
  },
  input: {
    fontSize: 18,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
  },
  registerButton: {
    width: 200,
    backgroundColor: "#4A55A2",
    padding: 15,
    marginTop: 50,
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 6,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
