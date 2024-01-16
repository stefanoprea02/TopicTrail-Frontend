import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import React from "react";
import { getGroupsContainingText, getUsersContainingText } from "../Functions";
import { JWTContext } from "../Context";

interface SearchModalProps {
  searchResult: (group: any, user: any) => void;
  closeSearchModal: () => void;
}

export default function SearchModal(props: SearchModalProps) {
  const { ip, jwt } = React.useContext(JWTContext);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      let groups = await getGroupsContainingText(ip, jwt, searchText);
      let users = await getUsersContainingText(ip, jwt, searchText);
      setSearchResults([...groups, ...users]);
    }
    if (searchText.length >= 3) fetchData();
    else setSearchResults([]);
  }, [searchText]);

  const renderSearchResult = ({ item }) => {
    if (item.title) {
      return (
        <TouchableWithoutFeedback
          onPress={() => props.searchResult(item, null)}
        >
          <Animated.View>
            <Text style={styles.searchResult}>{item.title}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() => props.searchResult(null, item)}
        >
          <Animated.View>
            <Text style={styles.searchResult}>{item.username}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    }
  };

  return (
    <Modal visible={true}>
      <ImageBackground
        source={require("../assets/Background.jpeg")}
        style={styles.backgroundImage}
      >
        <View style={styles.modalContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => props.closeSearchModal()}>
              <Icon name="left" style={styles.searchIcon} />
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              style={styles.inputBox}
              placeholder="search"
            />
          </View>
          {searchResults && (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topBar: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  searchResult: {
    fontSize: 25,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightblue",
    color: "lightblue",
  },
  inputBox: {
    borderColor: "#367CFE",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    padding: 12,
    backgroundColor: "#FFFFFF",
    width: "85%",
  },
  searchIcon: {
    fontSize: 30,
    color: "#367CFE",
  },
});
