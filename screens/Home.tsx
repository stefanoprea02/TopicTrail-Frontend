import React from "react";
import { ImageBackground, StatusBar } from "react-native";

import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { JWTContext } from "../Context";
import Icon from "react-native-vector-icons/AntDesign";
import SearchModal from "../components/SearchModal";
import Sorter from "../components/Sorter";
import { getUser, joinGroup, leaveGroup } from "../Functions";

export default function Home() {
  const { jwt, ip, username } = React.useContext(JWTContext);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [aux, setAux] = React.useState(false);
  const [group, setGroup] = React.useState<Group>(null);
  const [user, setUser] = React.useState<User>(null);
  const [searchedUser, setSearchedUser] = React.useState<User>(null);

  React.useEffect(() => {
    async function fetchData() {
      let address = "";

      const u = await getUser(ip, jwt, username);
      setUser(u);

      if (group) address = `${ip}/post/all?groupName=${group.title}`;
      else if (searchedUser)
        address = `${ip}/post/all?username=${searchedUser.username}`;
      else address = `${ip}/post/all`;

      let posts = await fetch(address, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => data);
      setPosts(posts);
    }
    fetchData();
  }, [aux, group, searchedUser]);

  const handlePress = async (type: string) => {
    if (type === "join") await joinGroup(ip, jwt, group.id);
    else await leaveGroup(ip, jwt, group.id);
    setAux((prev) => !prev);
  };

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            setSearchedUser(null);
            setGroup(null);
          }}
        >
          <Icon name="left" style={styles.searchIcon} />
        </TouchableOpacity>
        {group && <Text style={styles.groupName}>Group: {group.title}</Text>}
        {searchedUser && (
          <Text style={styles.groupName}>User: {searchedUser.username}</Text>
        )}
        <TouchableOpacity onPress={() => setIsSearching(true)}>
          <Icon name="search1" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {group && (
        <View style={styles.secondBar}>
          <Text style={styles.groupDescription}>{group.description}</Text>
          <Text
            style={styles.groupDescription}
            onPress={() =>
              handlePress(user.groups.includes(group.id) ? "leave" : "join")
            }
          >
            {user.groups.includes(group.id)
              ? "Click here to leave group"
              : "Click here to join group"}
          </Text>
        </View>
      )}

      {isSearching && (
        <SearchModal
          closeSearchModal={() => setIsSearching(false)}
          searchResult={(group, user) => {
            setGroup(group);
            setSearchedUser(user);
            setIsSearching(false);
          }}
        />
      )}

      <Sorter posts={posts} setAux={setAux} />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    marginTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  searchIcon: {
    fontSize: 30,
    color: "#FFFFFF",
  },
  topBar: {
    paddingTop: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  secondBar: {
    alignItems: "center",
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
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
