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
  KeyboardAvoidingView,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Profile from "../assets/Profile.jpg";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const navigation = useNavigation();

  // Function for mobile image picker
  const selectProfilePhoto = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          setProfilePhoto(uri);
        }
      };
      input.click();
    } else {
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
    }
  };

  // Function to open the camera (only for mobile)
  const openCamera = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Not supported",
        "Camera access is not available on the web."
      );
      return;
    }

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

  // Handle registration with validation
  const handleRegister = async () => {
    // Check for required fields
    if (!profilePhoto) {
      Alert.alert("Missing Profile Photo", "Please select a profile photo.");
      return;
    }
    if (!name) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }

    setDisabled(true);
    try {
      const user = {
        name: name,
        email: email,
        password: password,
      };

      const formData = new FormData();
      if (profilePhoto && Platform.OS === "web") {
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        formData.append("image", blob, "profile.jpg");
      } else if (profilePhoto) {
        formData.append("image", {
          uri: profilePhoto,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      for (const key in user) {
        formData.append(key, user[key]);
      }

      const response = await axios.post(
        "https://klicko-backend.onrender.com/user/register",
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
      setDisabled(false);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Registration failed", "Registration was unsuccessful");
      console.error("Registration failed", err);
      setDisabled(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Register to your account</Text>
          </View>

          <View style={styles.photoContainer}>
            <View style={styles.profileContainer}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.profilePhoto}
                />
              ) : (
                <Image source={Profile} style={styles.profilePhoto} />
              )}
              <TouchableOpacity style={styles.cameraIcon} onPress={openCamera}>
                <Icon name="camera" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <Button onPress={selectProfilePhoto} title="SELECT PROFILE PHOTO" />
          </View>

          <View style={styles.form}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Name"
              placeholderTextColor={"black"}
              value={name}
              onChangeText={setName}
              required
            />
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              placeholderTextColor={"black"}
              value={email}
              onChangeText={setEmail}
              required
            />
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter Your Password"
              placeholderTextColor={"black"}
              value={password}
              onChangeText={setPassword}
              required
            />
            <Pressable
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={disabled}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

            <Pressable
              style={styles.signInLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.signInText}>
                Already have an account? Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  header: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#4A55A2",
    fontSize: 17,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  photoContainer: {
    alignItems: "center",
    marginTop: 30,
  },
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
  form: {
    marginTop: 50,
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
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  signInLink: {
    marginTop: 15,
  },
  signInText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
