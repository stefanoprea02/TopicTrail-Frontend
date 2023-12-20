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
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#367CFE",
  },
  content: {
    fontSize: 18,
    color: "#666666",
    marginTop: 10,
  },
  postCreatedAt: {
    fontSize: 16,
    color: "#808080",
    fontStyle: "italic",
  },
});
