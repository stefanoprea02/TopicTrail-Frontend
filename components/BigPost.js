import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated,
  Modal,
} from "react-native";
import { JWTContext } from "../Context";
import Comment from "./Comment";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/AntDesign";
import User from "./User";
import { isAdmin, isModerator, removePost } from "../Functions";

export default function BigPost(props) {
  const { ip, jwt } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    content: "",
  });
  const [comments, setComments] = React.useState(null);
  const [aux, setAux] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [userIsAdmin, setIsAdmin] = React.useState(false);
  const [userIsMod, setIsMod] = React.useState(false);

  function handleChange(field, text) {
    setFormData({ ...formData, [field]: text });
  }

  React.useEffect(() => {
    async function fetchData() {
      let a = await isAdmin(ip, jwt);
      setIsAdmin(a);
      let m = await isModerator(ip, jwt, props.group);
      setIsMod(m);
      let comments = await fetch(`${ip}/post/${props.id}/comment`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => data);
      setComments(comments);
    }
    fetchData();
  }, [aux]);

  function handleSubmit() {
    const data = new FormData();
    data.append("text", formData.content);
    fetch(`${ip}/post/${props.id}/comment/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setFormData({ ...formData, ["content"]: "" });
        setAux(!aux);
      });
  }

  const renderComments = ({ item }) => {
    let isAuthority2 = userIsAdmin || userIsMod;
    return (
      <Comment
        text={item.text}
        username={item.username}
        createdAt={item.createdAt}
        isAuthority={isAuthority2}
        postId={item.postId}
        id={item.id}
        ip={ip}
        jwt={jwt}
      />
    );
  };

  async function sendMessageBigPost(message) {
    setSelectedUser(null);
    props.sendMessage(message);
  }

  let isAuthority = userIsAdmin || userIsMod;

  return (
    <ImageBackground
      source={require("../components/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.homePost}>
          <View style={styles.postDetails}>
            <View style={styles.postDetailsTop}>
              <Text style={styles.title}>{props.title}</Text>
              {isAuthority && (
                <TouchableOpacity
                  onPress={() => {
                    removePost(ip, jwt, props.id);
                  }}
                >
                  <Icon name="delete" style={styles.inputIcon}></Icon>
                </TouchableOpacity>
              )}
            </View>
            <TouchableWithoutFeedback
              onPress={() => setSelectedUser(props.username)}
            >
              <Animated.View>
                <Text style={styles.username}>
                  <Icon name="user" />
                  {props.username}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>

            <Text style={styles.content}>{props.content}</Text>
          </View>
          {comments && (
            <FlatList
              data={comments}
              renderItem={renderComments}
              keyExtractor={(item) => item.id}
            />
          )}
          <View style={styles.commentInput}>
            <TextInput
              value={formData.content}
              onChangeText={(text) => handleChange("content", text)}
              style={styles.inputBox}
              placeholder="Add a new comment"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
              <AntDesign name="right" style={styles.inputIcon}></AntDesign>
            </TouchableOpacity>
          </View>
          {selectedUser && (
            <Modal visible={true} animationType="slide">
              <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setSelectedUser(null)}>
                  <Icon name="left" style={styles.leftIcon} />
                </TouchableOpacity>
              </View>
              <User
                username={props.username}
                isAdmin={userIsAdmin}
                sendMessage={sendMessageBigPost}
              />
            </Modal>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  homePost: {
    marginVertical: 5,
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
    marginTop: 30,
  },
  topBar: {
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 8,
    marginRight: 25,
  },
  username: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  postDetails: {
    marginBottom: 10,
    alignItems: "center",
  },
  postDetailsTop: {
    flexDirection: "row",
    alignItems: "center",
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
  leftIcon: {
    fontSize: 30,
    color: "#4D5B9E",
    marginLeft: 15,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  content: {
    color: "black",
    fontSize: 21,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "black",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
