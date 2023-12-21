import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
} from "react-native";
import jwtDecode from "jwt-decode";
import { JWTContext } from "../Context";
import { getTime } from "../Functions";
import EventSource from "react-native-event-source";
import Conversation from "../components/Conversation";
import ModalMessages from "../components/ModalMessages";

export default function Messages({ navigation, route }) {
  const { jwt, ip } = React.useContext(JWTContext);
  const [listening, setListening] = React.useState(false);
  const [messageData, setMessageData] = React.useState<{
    [key: string]: Message[];
  }>({});
  const [userData, setUserData] = React.useState<Set<string>>(new Set());
  const [currentConv, setCurrentConv] = React.useState<string>();
  const [conversation, setConversation] = React.useState(route.params?.name);
  const receivedMessagesRef = React.useRef(new Set());
  const eventSourceRef = React.useRef(null);

  function changeConv(conv: string) {
    if (messageData[conv] !== undefined) {
    }
    if (currentConv != conv) setCurrentConv(conv);
  }

  React.useEffect(() => {
    if (conversation !== undefined) {
      setUserData((prevUserData) => new Set([...prevUserData, conversation]));
    }

    if (!listening && eventSourceRef.current === null) {
      setListening(true);
      const eventSourceUrl = `${ip}/messages/${(jwtDecode(jwt) as any).sub}`;
      eventSourceRef.current = new EventSource(eventSourceUrl, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("eventsource opened");

      eventSourceRef.current.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (!receivedMessagesRef.current.has(data.id)) {
          receivedMessagesRef.current.add(data.id);

          const sender =
            data.sender === (jwtDecode(jwt) as any).sub
              ? data.receiver
              : data.sender;

          setUserData((prevUserData) => new Set([...prevUserData, sender]));

          setMessageData((old) => {
            const key =
              data.sender === (jwtDecode(jwt) as any).sub
                ? data.receiver
                : data.sender;

            const updatedMessages = {
              ...old,
              [key]: [...(old[key] || []), data],
            };

            return updatedMessages;
          });
        }
      });

      eventSourceRef.current.onerror = (error) => {
        console.log("eventSourceRef.current error: ", error);
        setListening(false);
        eventSourceRef.current.close();
      };
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setListening(false);
        console.log("eventsource closed");
      }
    };
  }, [conversation, route.params?.name]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (route.params?.name) {
        setConversation(route.params?.name);
        setUserData(
          (prevUserData) => new Set([...prevUserData, route.params?.name])
        );
      }
    });
    return unsubscribe;
  }, [route.params?.name]);

  async function handleSubmit(formData: string) {
    const data = new FormData();
    data.append("id", "");
    data.append("content", formData);
    data.append("receiver", currentConv);
    data.append("sender", (jwtDecode(jwt) as any).sub);
    await fetch(`${ip}/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: data,
    });
  }

  let messages = (
    <ModalMessages
      currentConv={currentConv}
      resetConv={() => setCurrentConv(null)}
      handleSubmit={handleSubmit}
    />
  );
  if (
    messageData &&
    Object.keys(messageData).length !== 0 &&
    currentConv &&
    messageData[currentConv]
  ) {
    let messagesBySender = messageData[currentConv].map((message) => {
      const isSentByCurrentUser =
        message.sender === (jwtDecode(jwt) as any).sub;
      const messageStyle = isSentByCurrentUser
        ? styles.messageSent
        : styles.messageReceived;

      return (
        <View key={message.id} style={messageStyle}>
          <Text style={styles.messageText}>{message.content}</Text>
          <Text style={styles.messageDate}>{getTime(message.dateTime)}</Text>
        </View>
      );
    });

    return (
      <ModalMessages
        messagesBySender={messagesBySender}
        currentConv={currentConv}
        resetConv={() => setCurrentConv(null)}
        handleSubmit={handleSubmit}
      />
    );
  }

  const conversations = [...userData].map((item) => (
    <Conversation
      item={item}
      changeConv={changeConv}
      messageData={messageData[item]}
    />
  ));

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={{ padding: 10 }}>
        {conversations.length === 0 && (
          <Text style={styles.title}>
            Click on a conversation to start chatting
          </Text>
        )}
        <View>{conversations}</View>
        {currentConv && <View>{messages}</View>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    color: "white",
  },
  messageSent: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "lightskyblue",
    alignSelf: "flex-end",
    flexDirection: "row",
    maxWidth: "80%",
  },
  messageReceived: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 14,
    margin: 5,
    backgroundColor: "rgb(242,244,245)",
    alignSelf: "flex-start",
    flexDirection: "row",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    maxWidth: "70%",
  },
  messageDate: {
    fontSize: 12,
    marginLeft: 10,
  },
});
