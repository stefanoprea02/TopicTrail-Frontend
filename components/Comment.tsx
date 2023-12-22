import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { removeComment } from "../Functions";

export default function Comment(props) {
  if (props.createdAt[1][0] !== "0" && props.createdAt[1] < 10)
    props.createdAt[1] = "0" + props.createdAt[1];
  return (
    <View style={styles.comment}>
      <View style={styles.topBar}>
        <Text style={styles.username}>
          <Icon name="user" style = {styles.userIcon} />
          {props.username}
        </Text>
        <Text style={styles.postCreatedAt}>
          {props.createdAt[2]}.{props.createdAt[1]}.{props.createdAt[0]}
        </Text>
      </View>
      <View style={styles.topBar}>
        <Text style={styles.comText}>{props.text}</Text>
        {props.isAuthority && (
          <TouchableOpacity
            onPress={async () => {
              await removeComment(props.ip, props.jwt, props.postId, props.id);
              await props.fetchComms();
            }}
          >
            <Icon name="delete" style={styles.icon}></Icon>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15, 
    padding: 15, 
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10, 
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#367CFE", 
  },
  comText: {
    fontSize: 16,
    color: "#333", 
    marginBottom: 10, 
  },
  icon: {
    fontSize: 28,
    color: "#FF6347",
  },
  userIcon:{
    fontSize: 15,
  },
  postCreatedAt: {
    fontSize: 14,
    color: "#808080",
    fontStyle: "italic",
    marginBottom: 5, 
  },
});