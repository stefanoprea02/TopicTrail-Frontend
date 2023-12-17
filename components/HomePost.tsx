import React from "react";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";

export default function HomePost(props) {
  return (
    <View style={styles.homePost}>
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.postCreatedAt}>
          {props.postCreatedAt[2]}.{props.postCreatedAt[1]}.
          {props.postCreatedAt[0]}
        </Text>
      </View>
      <Text style={styles.content}>{props.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  homePost: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
    color: "#4D5B9E",
    fontWeight: "bold",
  },
  content: {
    color: "black",
    fontSize: 18,
  },
  postCreatedAt: {
    color: "gray",
    fontWeight: "bold",
  },
});
