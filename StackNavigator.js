import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreens from "./screens/FriendsScreens";
import ChatsScreen from "./screens/ChatsScreen";
import ChatMessageScreen from "./screens/ChatMessageScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Friends"
          component={FriendsScreens}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chats"
          component={ChatsScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messages"
          component={ChatMessageScreen}
          // options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
