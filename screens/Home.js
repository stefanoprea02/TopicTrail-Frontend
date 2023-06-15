import React from "react";
import { ImageBackground} from 'react-native';

import {
  View,
  Button,
  StyleSheet,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";
import HomePost from "../components/HomePost";
import BigPost from "../components/BigPost";
import Icon from "react-native-vector-icons/AntDesign";
import { adFavorite, checkFavorite, getGroupsContainingText, getUsersContainingText, removeFavorite } from "../Functions";
import FontAwesome from "react-native-vector-icons/FontAwesome"

export default function Home() {
  const { jwt, setJwt, ip } = React.useContext(JWTContext);
  const [posts, setPosts] = React.useState();
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [aux, setAux] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [group, setGroup] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [favorite, setFavorite] = React.useState(false);

  function logout() {
    setJwt("");
    save("");
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setAux(!aux);
    setIsRefreshing(false);
  }

  React.useEffect(() => {
    async function fetchData() {
      let address = "";
      if (group)
        address = `${ip}/post/all?groupName=${group.title}`;
      else if (user)
        address = `${ip}/post/all?username=${user.username}`;
      else
        address = `${ip}/post/all`;
      let posts = await fetch(address, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        }
      })
        .then((response) => response.json())
        .then((data) => data);
      setPosts(posts);
    }
    fetchData();
  }, [aux, group, user]);

  React.useEffect(() => {
    async function fetchData() {
      let fav = await checkFavorite(ip, jwt, selectedPost.id);
      setFavorite(fav);
    }
    if (selectedPost)
      fetchData();
    else
      setFavorite(false);
  }, [selectedPost]);

  React.useEffect(() => {
    async function fetchData() {
      let groups = await getGroupsContainingText(ip, jwt, searchText);
      let users = await getUsersContainingText(ip, jwt, searchText);
      setSearchResults([...groups, ...users]);
    }
    if (searchText.length >= 3)
      fetchData();
    else
      setSearchResults([])
  }, [searchText]);

  const renderPost = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedPost(item)}>
        <Animated.View>
          <HomePost title={item.title} content={item.content} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  const renderSearchResult = ({ item }) => {
    if (item.title) {
      return (
        <TouchableWithoutFeedback onPress={() => {
          setGroup(item);
          setUser(null);
          setSearchText("");
          setIsSearching(false);
        }}>
          <Animated.View>
            <Text style={styles.searchResult}>{item.title}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={() => {
          setUser(item);
          setGroup(null);
          setSearchText("");
          setIsSearching(false);
        }}>
          <Animated.View>
            <Text style={styles.searchResult}>{item.username}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    }
  }

  return (
    <ImageBackground source={require("../screens/Background.jpeg")} style={styles.backgroundImage}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {setUser(null); setGroup(null)}}>
          <Icon name="left" style={styles.searchIcon} />
        </TouchableOpacity>
        {group &&
          <Text style={styles.groupName}>Group: {group.title}</Text>
        }
        {user &&
          <Text style={styles.groupName}>User: {user.username}</Text>
        }
        <TouchableOpacity onPress={() => setIsSearching(true)}>
          <Icon name="search1" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      {group &&
        <View style={styles.secondBar}>
          <Text style={styles.groupDescription}>{group.description}</Text>
        </View>
      }
      {isSearching &&
       
      <Modal visible={true}>
        <ImageBackground source={require("../screens/Background.jpeg")} style={styles.backgroundImage}>
          <View style={styles.modalContainer}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => setIsSearching(false)}>
                <Icon name="left" style={styles.searchIcon} />
              </TouchableOpacity>
              <TextInput
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                style={styles.inputBox}
                placeholder="search"
              />
            </View>
            {searchResults &&
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
              />}
          </View>
        
        </ImageBackground>
      </Modal>
      }
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      {/* <Button title="Sign out" onPress={logout} /> */}
      <TouchableOpacity style={styles.button} onPress={logout} title="Sign out">
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      {selectedPost &&
        <Modal visible={true} animationType="slide" style={styles.modalContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setSelectedPost(null)}>
              <Icon name="left" style={styles.searchIcon} />
            </TouchableOpacity>
            {favorite ?
              <TouchableOpacity onPress={async () => { await removeFavorite(ip, jwt, selectedPost.id); setFavorite(false) }}>
                <FontAwesome name="bookmark" style={styles.searchIcon}></FontAwesome>
              </TouchableOpacity> :
              <TouchableOpacity onPress={async () => { await adFavorite(ip, jwt, selectedPost.id); setFavorite(true) }}>
                <FontAwesome name="bookmark-o" style={styles.searchIcon}></FontAwesome>
              </TouchableOpacity>
            }
          </View>
          <BigPost 
            title={selectedPost.title} 
            content={selectedPost.content} 
            id={selectedPost.id} 
            username={selectedPost.username} 
            group={selectedPost.group}
          />
        </Modal>
      }
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F6FB',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    inputBox: {
      borderColor: '#4D5B9E',
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 18,
      padding: 12,
      backgroundColor: '#FFFFFF',
      width: '85%'
    },
    searchResult: {
      fontSize: 25,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightblue',
      color: 'lightblue',
    },
    searchIcon: {
      fontSize: 30,
      color: '#4D5B9E',
    },
    topBar: {
      paddingTop: 10,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    groupName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4D5B9E',
    },
    secondBar: {
      alignItems: 'center',
      marginBottom: 10,
    },
    groupDescription: {
      fontSize: 16,
      color: '#4D5B9E',
      textAlign: 'center',
    },
    container: {
        flex: 1,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Ajustează comportamentul imaginii în funcție de nevoi (cover, contain, etc.)
      },
          button: {
        backgroundColor: '#4D5B9E',
        borderRadius: 5,
        paddingVertical: 12,
        marginTop: 20,
        alignItems: 'center',
        marginLeft: 35,
        marginRight: 35,
        marginBottom: 20,
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
  });
  

