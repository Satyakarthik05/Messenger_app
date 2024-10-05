import React, { useState } from "react";
import { StyleSheet } from "react-native";
import StackNavigator from "./StackNavigator";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "../messenger/UserContext";

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
