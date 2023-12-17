import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import { JWTContext } from "../Context";
import { getTime } from "../Functions";
import AntDesign from "react-native-vector-icons/AntDesign";
import EventSource from "react-native-event-source";
import Icon from "react-native-vector-icons/AntDesign";

export default function Messages() {
  const { jwt, setJwt, ip } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [messageData, setMessageData] = React.useState<{
    [key: string]: Message[];
  }>({});
  const [userData, setUserData] = React.useState<Set<string>>(new Set());
  const [currentConv, setCurrentConv] = React.useState<string>();
  const route = useRoute();
  const [conversation, setConversation] = React.useState(route.params?.name);
  const receivedMessagesRef = React.useRef(new Set());
  let eventSource = null;

  function changeConv(conv: string) {
    if (messageData[conv] !== undefined) {
    }
    if (currentConv != conv) setCurrentConv(conv);
  }

  React.useEffect(() => {
    if (conversation !== undefined) {
      setUserData((prevUserData) => new Set([...prevUserData, conversation]));
    }

    if (!listening && eventSource == undefined) {
      setListening(true);
      const eventSourceUrl = `${ip}/messages/${(jwtDecode(jwt) as any).sub}`;
      eventSource = new EventSource(eventSourceUrl, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      eventSource.addEventListener("message", (event) => {
        if (event.data !== undefined) {
          let data = JSON.parse(event.data);

          if (!receivedMessagesRef.current.has(data.id)) {
            receivedMessagesRef.current.add(data.id); // Update the receivedMessages set

            if (data.sender !== (jwtDecode(jwt) as any).sub) {
              setUserData(
                (prevUserData) => new Set([...prevUserData, data.sender])
              );
            } else {
              setUserData(
                (prevUserData) => new Set([...prevUserData, data.receiver])
              );
            }

            setMessageData((old) => {
              if (data.sender === (jwtDecode(jwt) as any).sub) {
                if (old[data.receiver] !== undefined) {
                  return {
                    ...old,
                    [data.receiver]: [...old[data.receiver], data],
                  };
                } else {
                  return {
                    ...old,
                    [data.receiver]: [data],
                  };
                }
              } else {
                if (old[data.sender] !== undefined) {
                  return {
                    ...old,
                    [data.sender]: [...old[data.sender], data],
                  };
                } else {
                  return {
                    ...old,
                    [data.sender]: [data],
                  };
                }
              }
            });
          }
        }
      });
      eventSource.onerror = (error) => {
        console.log("eventsource error: ", error);
        eventSource.close();
      };
    }

    return () => {
      eventSource.close();
      console.log("eventsource closed");
    };
  }, []);

  async function handleSubmit() {
    const data = new FormData();
    data.append("id", "");
    data.append("content", formData);
    data.append("receiver", currentConv);
    data.append("sender", (jwtDecode(jwt) as any).sub);
    setFormData("");
    const response = await fetch(`${ip}/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: data,
    });
  }

  let messages = [];
  if (messageData && Object.keys(messageData).length !== 0) {
    messages = Object.keys(messageData).map((sender) => {
      let messagesBySender = [];
      for (let i = 0; i < messageData[sender].length; i++) {
        if (messageData[sender][i].sender === (jwtDecode(jwt) as any).sub) {
          messagesBySender.push(
            <View key={messageData[sender][i].id} style={styles.messageSent}>
              <Text style={styles.messageText}>
                {messageData[sender][i].content}
              </Text>
              <Text style={styles.messageDate}>
                {getTime(messageData[sender][i].dateTime)}
              </Text>
            </View>
          );
        } else {
          messagesBySender.push(
            <View
              key={messageData[sender][i].id}
              style={styles.messageReceived}
            >
              <Text style={styles.messageText}>
                {messageData[sender][i].content}
              </Text>
              <Text style={styles.messageDate}>
                {getTime(messageData[sender][i].dateTime)}
              </Text>
            </View>
          );
        }
      }
      if (sender === currentConv) {
        return (
          <Modal key={`${sender}m`} visible={true} animationType="slide">
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => setCurrentConv(null)}>
                <Icon name="left" style={styles.leftIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.messageView}>
              <ScrollView>
                <View
                  key={`${sender}m`}
                  id={sender}
                  style={styles.messageContainer}
                >
                  {messagesBySender}
                </View>
              </ScrollView>
              <View style={styles.messageInput}>
                <TextInput
                  value={formData}
                  onChangeText={(text) => setFormData(text)}
                  style={styles.inputBox}
                  placeholder="Send a message"
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.sendButton}
                >
                  <AntDesign name="right" style={styles.inputIcon}></AntDesign>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      } else {
        return (
          <View key={`${sender}m`} style={{ display: "none" }} id={sender}>
            {messagesBySender}
          </View>
        );
      }
    });
  } else {
    if (currentConv) {
      return (
        <Modal key={`m`} visible={true} animationType="slide">
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => {
                setCurrentConv(null);
                console.log("DA");
              }}
            >
              <Icon name="left" style={styles.leftIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.messageView}>
            <View style={styles.messageInput}>
              <TextInput
                value={formData}
                onChangeText={(text) => setFormData(text)}
                style={styles.inputBox}
                placeholder="Send a message"
              />
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.sendButton}
              >
                <AntDesign name="right" style={styles.inputIcon}></AntDesign>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  }

  let conversations = [];
  if (userData !== undefined) {
    userData.forEach((item) => {
      conversations.push(
        <TouchableWithoutFeedback key={item} onPress={() => changeConv(item)}>
          <View style={styles.conversation}>
            <View style={styles.conversationTop}>
              <Text style={styles.conversationName}>{item}</Text>
              {messageData[item] && (
                <Text>
                  {getTime(
                    messageData[item][messageData[item].length - 1].dateTime
                  )}
                </Text>
              )}
            </View>
            {messageData[item] && (
              <Text>
                {messageData[item][messageData[item].length - 1].content}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View>
        <Text style={styles.title}>
          Click on a conversation to start chatting
        </Text>
        <View>{conversations}</View>
        <View>{messages}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  conversation: {
    borderBottomWidth: 1,
    borderColor: "gray",
    width: "100%",
    padding: 10,
  },
  conversationTop: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 3,
  },
  conversationName: {
    fontSize: 18,
    color: "#4D5B9E",
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inputBox: {
    borderColor: "#4D5B9E",
    borderWidth: 0.2,
    marginVertical: 5,
    fontSize: 18,
    padding: 12,
    width: "85%",
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#4D5B9E",
    borderWidth: 0.2,
    padding: 6,
  },
  inputIcon: {
    fontSize: 39,
  },
  topBar: {
    paddingTop: 10,
    marginBottom: 10,
  },
  leftIcon: {
    fontSize: 30,
    color: "#4D5B9E",
    marginLeft: 15,
  },
  messageView: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageContainer: {
    minWidth: "auto",
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});
