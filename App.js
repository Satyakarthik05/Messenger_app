import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import StackNavigator from "./StackNavigator";
import { StatusBar } from "expo-status-bar";
// import { UserContext } from "../messenger/UserContext";
import { UserContext } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
