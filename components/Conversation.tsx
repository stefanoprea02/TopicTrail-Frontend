import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { getTime } from "../Functions";

interface ConversationPropss {
  item: string;
  changeConv: (item: string) => void;
  messageData: Message[];
}

export default function Conversation({
  item,
  changeConv,
  messageData,
}: ConversationPropss) {
  return (
    <TouchableWithoutFeedback key={item} onPress={() => changeConv(item)}>
      <View style={styles.conversation}>
        <View style={styles.conversationTop}>
          <Text style={styles.conversationName}>{item}</Text>
          {messageData && (
            <Text>{getTime(messageData[messageData.length - 1].dateTime)}</Text>
          )}
        </View>
        {messageData && (
          <Text>{messageData[messageData.length - 1].content}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  conversation: {
    borderBottomWidth: 1,
    borderColor: "white",
    width: "100%",
    padding: 10,
  },
  conversationTop: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 3,
  },
  conversationName: {
    marginRight: 5,
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
