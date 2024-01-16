import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  RefreshControl,
  StatusBar,
  ListRenderItemInfo,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { JWTContext } from "../Context";
import { getUser, getFavoritePosts } from "../Functions";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/AntDesign";
import Sorter from "../components/Sorter";
import ProfileModalActions from "../components/ProfileModActions";
import EditBio from "../components/EditBio";
import Comment from "../components/Comment";
import HomePost from "../components/HomePost";

const screenWidth = Dimensions.get("window").width;

export default function Profile({ navigation, route }) {
  const { jwt, ip, username } = useContext(JWTContext);
  const [user, setUser] = useState<User>(null);
  const [showAdminAction, setShowAdminAction] = useState(false);
  const [showBioEdit, setShowBioEdit] = useState(false);
  const [contentType, setContentType] = useState<
    "Posts" | "Comments" | "Favorites"
  >("Posts");
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileUsername, setProfileUsername] = useState(
    route.params?.name || username
  );
  const [favoritePosts, setFavoritePosts] = useState([]);

  async function reloadUser() {
    const res = await getUser(ip, jwt, profileUsername);
    setUser(res);

    console.log(contentType);

    let posts = await fetch(`${ip}/post/all?username=${profileUsername}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    const favPosts = await getFavoritePosts(ip, jwt, profileUsername);
    setFavoritePosts(favPosts);

    setPosts(posts);

    let comments = await fetch(`${ip}/comments/${profileUsername}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data);
    setComments(comments);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setProfileUsername(route.params?.name || username);
    });
    return unsubscribe;
  }, [navigation, route.params?.name]);

  useEffect(() => {
    reloadUser();
  }, [profileUsername]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      try {
        await fetch(`${ip}/user/changeImage`, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${jwt}`,
            ContentType: "multipart/form-data",
          },
        });
        await reloadUser();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const renderComments = ({ item }) => {
    return (
      <Comment
        text={item.text}
        username={item.username}
        createdAt={item.createdAt}
        postId={item.postId}
        id={item.id}
        ip={ip}
        jwt={jwt}
        fetchComms={reloadUser}
      />
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    reloadUser();
    setIsRefreshing(false);
  };

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.imageContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <TouchableOpacity
            style={styles.topActionButtonContainer}
            onPress={() => setShowAdminAction((prev) => !prev)}
          >
            <Feather name="settings" size={24} />
          </TouchableOpacity>
          <View style={styles.usernameContainer}>
            {profileUsername !== username && (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setProfileUsername(username)}
              >
                <Icon name="left" size={24} />
              </TouchableOpacity>
            )}
            <Text style={styles.username}>
              <Icon name="user" style={styles.icon} />
              {profileUsername}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.topActionButtonContainer}
            onPress={() => setShowBioEdit(true)}
          >
            <Feather name="edit" size={24} />
          </TouchableOpacity>
        </View>
        <Image
          source={
            user && user.profileImage
              ? { uri: `data:image/jpeg;base64,${user.profileImage}` }
              : require("../assets/default-profile-pic.webp")
          }
          style={styles.image}
        />
        {user && user.username === username && (
          <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
            <Feather name="edit-2" size={24} />
          </TouchableOpacity>
        )}
        {user && user.bio && <Text style={styles.username}>{user.bio}</Text>}
      </View>

      {user && showAdminAction && (
        <ProfileModalActions
          user={user}
          contentType={contentType}
          setContentType={setContentType}
        />
      )}

      {contentType === "Posts" && <Sorter posts={posts} />}

      {contentType === "Comments" && (
        <FlatList
          data={comments}
          renderItem={renderComments}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
      {contentType === "Favorites" && <Sorter posts={favoritePosts} />}

      <EditBio
        showBioEdit={showBioEdit}
        hideModal={(type) => {
          if (type === "submit") reloadUser();
          setShowBioEdit(false);
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    marginTop: StatusBar.currentHeight,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 200,
  },
  iconContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 200,
    alignSelf: "flex-start",
    padding: 10,
    top: 120,
    left: screenWidth / 2 + 20,
  },
  topActionButtonContainer: {
    backgroundColor: "white",
    borderRadius: 200,
    padding: 10,
  },
  usernameContainer: { flexDirection: "row", alignItems: "center" },
  username: {
    fontSize: 18,
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
  },
});
