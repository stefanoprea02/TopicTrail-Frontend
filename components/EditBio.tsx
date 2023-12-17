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
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.inputBox}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Edit bio</Text>
          </TouchableOpacity>
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
  inputBox: {
    borderColor: "#4D5B9E",
    borderWidth: 0.5,
    marginVertical: 5,
    fontSize: 25,
    padding: 30,
    marginTop: 25,
    backgroundColor: "#F0FFFF",
    textAlignVertical: "top",
    textAlign: "center",
    width: "90%",
  },
  button: {
    backgroundColor: "#4D5B9E",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    padding: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
