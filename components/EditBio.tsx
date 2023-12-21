import { useState, useContext } from "react";
import {
  ImageBackground,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import { JWTContext } from "../Context";
import ActionButton from "./ActionButton";

interface EditBioProps {
  showBioEdit: boolean;
  hideModal: (type?: string) => void;
}

export default function EditBio(props: EditBioProps) {
  const { ip, jwt } = useContext(JWTContext);
  const [bio, setBio] = useState("");

  const handleSubmit = async () => {
    try {
      await fetch(`${ip}/user/bio?bio=${encodeURIComponent(bio)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (err) {
      console.log(err);
    }

    setBio("");
    props.hideModal("submit");
  };

  return (
    <Modal visible={props.showBioEdit}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => props.hideModal()}>
          <Icon name="left" style={styles.modalIcon} />
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require("../assets/Background.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.inputBox}
          />
          <ActionButton actionName="Edit bio" onSubmit={handleSubmit} />
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
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalIcon: {
    fontSize: 30,
    color: "#4D5B9E",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15%",
    marginBottom: "5%",
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
    width: "90%",
  },
});
