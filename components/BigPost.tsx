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
} from "react-native";
import { JWTContext } from "../Context";
import Comment from "./Comment";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/AntDesign";
import { isAdmin, isModerator, removePost } from "../Functions";
import OneLineInput from "./OneLineInput";

interface BigPostProps {
  goToProfile: (username: string) => void;
  post: Post;
}

export default function BigPost(props: BigPostProps) {
  const { ip, jwt } = React.useContext(JWTContext);
  const [comments, setComments] = React.useState(null);
  const [userIsAdmin, setIsAdmin] = React.useState(false);
  const [userIsMod, setIsMod] = React.useState(false);

  const fetchComms = async () => {
    let comments = await fetch(`${ip}/post/${props.post.id}/comment`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    setComments(comments);
  };

  React.useEffect(() => {
    async function fetchData() {
      let a = await isAdmin(ip, jwt);
      setIsAdmin(a);
      let m = await isModerator(ip, jwt, props.post.group);
      setIsMod(m);

      await fetchComms();
    }
    fetchData();
  }, []);

  async function handleSubmit(formData: string) {
    const data = new FormData();
    data.append("text", formData);
    await fetch(`${ip}/post/${props.post.id}/comment/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: data,
    });
    await fetchComms();
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
        fetchComms={fetchComms}
      />
    );
  };

  let isAuthority = userIsAdmin || userIsMod;

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.homePost}>
          <View style={styles.postDetails}>
            <View style={styles.postDetailsTop}>
              <Text style={styles.title}>{props.post.title}</Text>
              {isAuthority && (
                <TouchableOpacity
                  onPress={() => {
                    removePost(ip, jwt, props.post.id);
                  }}
                >
                  <Icon name="delete" style={styles.inputIcon}></Icon>
                </TouchableOpacity>
              )}
            </View>
            <TouchableWithoutFeedback
              onPress={() => props.goToProfile(props.post.username)}
            >
              <Animated.View>
                <Text style={styles.username}>
                  <Icon name="user" />
                  {props.post.username}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>

            <Text style={styles.content}>{props.post.content}</Text>
          </View>
          {comments && (
            <FlatList
              data={comments}
              renderItem={renderComments}
              keyExtractor={(item) => item.id}
            />
          )}
          <OneLineInput
            handleSubmit={handleSubmit}
            placeholderText="Add a comment"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  homePost: {
    marginVertical: 20,
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
    marginTop: 30,
    backgroundColor: "#d7e5ff",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#367CFE",
  },
  username: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  postDetails: {
    marginBottom: 10,
    alignItems: "center",
  },
  postDetailsTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    fontSize: 24,
    color: "#FF3D57",
    marginLeft: 10,
  },
  inputBox: {
    borderColor: "#367CFE",
    borderWidth: 0.5,
    marginVertical: 10,
    fontSize: 18,
    padding: 12,
    width: "85%",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#367CFE",
    borderWidth: 0.5,
    padding: 8,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "#367CFE",
  },
  inputIcon: {
    fontSize: 20,
    color: "#555",
    marginLeft: 10,
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
    paddingHorizontal: 20,
  },
  content: {
    color: "#666666",
    fontSize: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#555",
    width: "100%",
    marginTop: 15,
    marginLeft: 25,
    paddingVertical: 5,
  },
});
