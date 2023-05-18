import React from "react";
import { View, Button, StyleSheet, FlatList, Animated, TouchableWithoutFeedback, Modal, TextInput, RefreshControl, Text, TouchableOpacity } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";
import HomePost from "../components/HomePost";
import BigPost from "../components/BigPost";
import Icon from "react-native-vector-icons/AntDesign";
import { adFavorite, checkFavorite, getGroupsContainingText, getUsersContainingText, removeFavorite } from "../Functions";
import FontAwesome from "react-native-vector-icons/FontAwesome"

export default function Home(){
    const {jwt, setJwt, ip} = React.useContext(JWTContext);
    //tine minte toate postarile
    const [posts, setPosts] = React.useState();
    //atunci cand apesi pe o postare este salvata aici
    const [selectedPost, setSelectedPost] = React.useState(null);
    //textul din bara de cautare
    const [searchText, setSearchText] = React.useState("");
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);
    const [aux, setAux] = React.useState(false);
    //tine minte toate rezultatele cautarii
    const [searchResults, setSearchResults] = React.useState([]);
    //tine minte grupul care a fost selectat in bara de cautare
    const [group, setGroup] = React.useState(null);
    //tine minte userul care a fost selectat in bara de cautare
    const [user, setUser] = React.useState(null);
    //tine minte daca postarea selectata este favorita sau nu
    const [favorite, setFavorite] = React.useState(false);

    function logout(){
        setJwt("");
        save("");
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        setAux(!aux);
        setIsRefreshing(false);
    }

    //cauta postari dupa grup sau user
    React.useEffect(() => {
        async function fetchData(){
            let address = "";
            if(group)
                address = `${ip}/post/all?groupName=${group.title}`;
            else if(user)
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
        async function fetchData(){
            let fav = await checkFavorite(ip, jwt, selectedPost.id);
            setFavorite(fav);
        }
        if(selectedPost)
            fetchData();
        else
            setFavorite(false);
    }, [selectedPost]);

    //pentru a cauta grupuri sau useri
    React.useEffect(() => {
        async function fetchData(){
            let groups = await getGroupsContainingText(ip, jwt, searchText);
            let users = await getUsersContainingText(ip, jwt, searchText);
            setSearchResults([...groups, ...users]);
        }
        if(searchText.length >= 3)
            fetchData();
        else
            setSearchResults([])
    }, [searchText]);
    
    const renderPost = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={()=>setSelectedPost(item)}>   
                <Animated.View>
                    <HomePost title={item.title} content={item.content} />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    };

    const renderSearchResult = ({ item }) => {
        if(item.title){
            return (
                <TouchableWithoutFeedback onPress={function(){
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
        }else{
            return (
                <TouchableWithoutFeedback onPress={function(){
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
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={function(){setGroup(null); setUser(null)}}>
                    <Icon name="left" style={styles.searchIcon} />
                </TouchableOpacity>
                {group && 
                    <Text style={styles.groupName}>Group : {group.title}</Text>
                }
                {user && 
                    <Text style={styles.groupName}>User : {user.username}</Text>
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
                <Modal>
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
            <Button title="Signout" onPress={logout} />
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
                    <BigPost title={selectedPost.title} content={selectedPost.content} id={selectedPost.id} />
                </Modal>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    modalContainer: {
        flex: 1,
        margin: 100
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        fontSize: 18,
        padding: 12,
        textAlignVertical: 'top',
        width: '80%'
    },
    searchResult: {
        fontSize: 22,
        padding: 10
    },
    searchIcon: {
        fontSize: 50
    },
    topBar: {
        paddingTop: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 10
    },
    groupName: {
        fontSize: 20
    },
    secondBar: {
        alignItems: 'center',
        paddingTop: 10
    },
    groupDescription: {
        fontSize: 18,
    }
})