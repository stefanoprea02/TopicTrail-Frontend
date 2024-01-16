import React from "react";

import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { JWTContext } from "../Context";
import BigPost from "../components/BigPost";
import Icon from "react-native-vector-icons/AntDesign";
import { adFavorite, checkFavorite, removeFavorite } from "../Functions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { CommonActions, useNavigation } from "@react-navigation/native";

interface PostModalProps {
  selectedPost: Post;
  hideModal: () => void;
}

export default function PostModal(props: PostModalProps) {
  const { ip, jwt } = React.useContext(JWTContext);
  const [favorite, setFavorite] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    async function fetchData() {
      let fav = await checkFavorite(ip, jwt, props.selectedPost.id);
      setFavorite(fav);
    }
    if (props.selectedPost) fetchData();
    else setFavorite(false);
  }, [props.selectedPost]);

  async function goToProfile(username) {
    props.hideModal();
    navigation.dispatch(
      CommonActions.navigate({
        name: "Profile",
        params: {
          name: username,
        },
      })
    );
  }

  return (
    <Modal
      visible={!!props.selectedPost}
      animationType="slide"
      style={styles.modalContainer}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => props.hideModal()}>
          <Icon name="left" style={styles.icon} />
        </TouchableOpacity>
        {favorite ? (
          <TouchableOpacity
            onPress={async () => {
              await removeFavorite(ip, jwt, props.selectedPost.id);
              setFavorite(false);
            }}
          >
            <FontAwesome name="heart" style={styles.icon}></FontAwesome>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await adFavorite(ip, jwt, props.selectedPost.id);
              setFavorite(true);
            }}
          >
            <FontAwesome name="heart-o" style={styles.icon}></FontAwesome>
          </TouchableOpacity>
        )}
      </View>
      <BigPost post={props.selectedPost} goToProfile={goToProfile} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  icon: {
    fontSize: 30,
    color: "#367CFE",
  },
  topBar: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#367CFE",
  },
  secondBar: {
    alignItems: "center",
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: "#367CFE",
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#367CFE",
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});