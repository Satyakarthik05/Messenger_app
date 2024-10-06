import React, {
  useLayoutEffect,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { TextInput } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import io from "socket.io-client"; // Import Socket.IO client
// import { io } from "(http://192.168.128.105:4000)-client";

const ChatMessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [reciepentData, setReciepentData] = useState();
  const [showEmojiSelector, setshowEmojiSelector] = useState(false);
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [selectImage, setselectImage] = useState("");
  const { reciepentId } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const socketListenerAttached = useRef(false);

  const scrollViewRef = useRef(null);
  const socket = useRef(null);

  const handleSent = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", reciepentId); // Ensure spelling consistency (recipient)

      if (messageType === "image") {
        formData.append("messageType", "image");

        // Append the image file with proper structure
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg", // or dynamically use the name if available
          type: "image/jpeg", // Ensure type matches the file
        });
      } else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }

      // Make a POST request to your backend API
      const response = await fetch(
        "https://klicko-backend.onrender.com/messages",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error in response:", errorResponse);
        throw new Error(errorResponse.message || "Something went wrong");
      }

      // Emit the new message to the socket for real-time updates
      socket.current.emit("newMessage", {
        senderId: userId,
        recepientId: reciepentId,
        messageType: messageType,
        message: message,
        timeStamp: new Date().toISOString(),
        imageUrl: messageType === "image" ? imageUri : null,
      });

      // Clear message input and reset image
      setmessage("");
      setselectImage("");
      fetchMessages(); // Optionally refetch the messages
    } catch (error) {
      console.error("Error in sending message:", error.message);
    }
  };

  useEffect(() => {
    // Initialize socket connection only once
    if (!socket.current) {
      socket.current = io("https://klicko-backend.onrender.com", {
        withCredentials: true,
        transports: ["websocket"],
      });

      // Join the room for real-time updates
      socket.current.emit("joinRoom", {
        senderId: userId,
        recepientId: reciepentId,
      });
    }

    // Attach listener only once
    if (!socketListenerAttached.current) {
      const messageListener = (newMessage) => {
        setmessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg._id === newMessage._id
          );
          if (!messageExists) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
        scrollToBottom(); // Scroll to bottom on new message
      };

      socket.current.on("newMessage", messageListener);
      socketListenerAttached.current = true; // Ensure listener is attached only once

      // Clean up listener on unmount
      return () => {
        socket.current.off("newMessage", messageListener);
        socketListenerAttached.current = false; // Reset when component unmounts
      };
    }

    // Fetch initial messages when component mounts
    fetchMessages();

    // Polling to fetch messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Adjust interval as needed

    // Clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [userId, reciepentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Update scroll when messages change

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://klicko-backend.onrender.com/messages/${userId}/${reciepentId}`
      );
      const data = await response.json();
      if (response.ok) {
        setmessages((prevMessages) => {
          // Combine previous messages with newly fetched messages and remove duplicates
          const allMessages = [...prevMessages, ...data];
          const uniqueMessages = allMessages.reduce((acc, curr) => {
            if (!acc.some((msg) => msg._id === curr._id)) {
              acc.push(curr);
            }
            return acc;
          }, []);
          return uniqueMessages;
        });
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // Fetch messages initially on component mount
  useEffect(() => {
    fetchMessages();
  }, [userId, reciepentId]);

  useEffect(() => {
    const fetchReciepentData = async () => {
      try {
        const response = await fetch(
          `https://klicko-backend.onrender.com/user/${reciepentId}`
        );

        const data = await response.json();

        if (response.ok) {
          setReciepentData(data);
        } else {
          console.error("Failed to fetch recipient data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching recipient data:", error);
      }
    };

    fetchReciepentData();
  }, [reciepentId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectedMessage.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessage.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{
                  uri: `https://klicko-backend.onrender.com/${reciepentData?.image.replace(
                    /\\/g,
                    "/"
                  )}`,
                }}
              />

              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {reciepentData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessage.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons name="share" size={24} color="black" />
            <Ionicons name="arrow-undo-sharp" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessage)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [reciepentData, selectedMessage]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch(
        "https://klicko-backend.onrender.com/deletemessages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: messageIds }),
        }
      );

      if (response.ok) {
        setSelectedMessage((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );
        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  console.log("messages", messages);

  const handleSelectMessage = async (message) => {
    const isSelected = selectedMessage.includes(message._id);

    if (isSelected) {
      setSelectedMessage((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessage((previousMessages) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };

  const formatTime = (time) => {
    // Convert to milliseconds if the input is in seconds
    const milliseconds =
      typeof time === "number" && time < 1e12 ? time * 1000 : time;

    const date = new Date(milliseconds);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result); // Log the result to see its structure

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri; // Access the URI correctly
      console.log("Selected Image URI:", imageUri); // Log the URI
      handleSent("image", imageUri); // Pass the correct URI to handleSent
    }
  };
  console.log(selectedMessage);

  return (
    <KeyboardAvoidingView style={{ flex: 1, color: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          const isUserMessage = item.senderId === userId;
          if (item.messageType === "text" || item.messageType === "image") {
            const isSelected = selectedMessage.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  {
                    alignSelf: isUserMessage ? "flex-end" : "flex-start",
                    backgroundColor: isUserMessage ? "#DCFCC6" : "white",
                    padding: 6,
                    borderRadius: 7,
                    maxWidth: "60%",
                    marginTop: 3,
                    marginRight: isUserMessage ? 5 : 0,
                    marginLeft: isUserMessage ? 0 : 7,
                  },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                {item.messageType === "text" ? (
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: isSelected ? "right" : "left",
                    }}
                  >
                    {item?.message}
                  </Text>
                ) : (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 150, height: 150, borderRadius: 10 }}
                  />
                )}
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 7,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item?.timeStamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          name="emoji-happy"
          size={24}
          color="gray"
          style={{ marginRight: 5 }}
          onPress={() => setshowEmojiSelector(!showEmojiSelector)} // Toggle emoji selector
        />
        <TextInput
          value={message}
          onChangeText={(text) => setmessage(text)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          {/* <Entypo
            name="camera"
            size={24}
            color="gray"
            onPress={() => pickImage()}
          />
          <Feather name="mic" size={24} color="gray" /> */}
        </View>
        <Pressable
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
          onPress={() => handleSent("text")}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Send
          </Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          style={{ height: 250 }}
          onEmojiSelected={(emoji) => {
            setmessage((prevMessage) => prevMessage + emoji);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessageScreen;
