import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import OneLineInput from "./OneLineInput";

interface ModalMessagesProps {
  messagesBySender?: React.JSX.Element[];
  currentConv: string;
  resetConv: () => void;
  handleSubmit: (formData: string) => void;
}

export default function ModalMessages({
  messagesBySender,
  currentConv,
  resetConv,
  handleSubmit,
}: ModalMessagesProps) {
  return (
    <Modal key={`${currentConv}m`} visible={true} animationType="slide">
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/Background.jpeg")}
      >
        <View style={{ flex: 1, height: "100%" }}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={resetConv}>
              <Icon name="left" style={styles.leftIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.messageView}>
            <ScrollView>
              <View
                key={`${currentConv}m`}
                id={currentConv}
                style={styles.messageContainer}
              >
                {messagesBySender ? messagesBySender : ""}
              </View>
            </ScrollView>
            <View style={{ padding: 10 }}>
              <OneLineInput
                handleSubmit={handleSubmit}
                placeholderText="Send a message"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  topBar: {
    paddingTop: 10,
    marginBottom: 10,
  },
  leftIcon: {
    fontSize: 30,
    color: "white",
    marginLeft: 15,
  },
  messageView: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageContainer: {
    minWidth: "auto",
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});
