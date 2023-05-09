import React from "react";
import { View, Button, StyleSheet, FlatList, Animated, TouchableWithoutFeedback, Modal } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";
import HomePost from "../components/HomePost";
import BigPost from "../components/BigPost";

export default function Home(){
    const {jwt, setJwt, ip} = React.useContext(JWTContext);
    const [posts, setPosts] = React.useState();
    const [selectedPost, setSelectedPost] = React.useState(null);

    function logout(){
        setJwt("");
        save("");
    }

    React.useEffect(() => {
        async function fetchData(){
            let posts = await fetch(`${ip}/post/all`, {
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
    }, []);

    const renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={()=>setSelectedPost(item)}>   
                <Animated.View>
                    <HomePost title={item.title} content={item.content} />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList 
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <Button title="Signout" onPress={logout} />
            {selectedPost && 
                <Modal visible={true} animationType="slide" style={styles.modalContainer}>
                    <BigPost title={selectedPost.title} content={selectedPost.content} id={selectedPost.id} />
                    <Button onPress={() => setSelectedPost(null)} title="Close" />
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
    }
})