import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../JWTContext";
import { StyleSheet } from "react-native";
import HomePost from "../components/HomePost";
import { FlatList } from "react-native";

export default function Home(){
    const {jwt, setJwt} = React.useContext(JWTContext);
    const [posts, setPosts] = React.useState();

    function logout(){
        setJwt("");
        save("");
    }

    React.useEffect(() => {
        async function fetchData(){
            let posts = await fetch("http://192.168.0.105:8080/post/all", {
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
        return <HomePost title={item.title} content={item.content} />;
    };

    return (
        <View style={styles.container}>
            <FlatList 
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <Button title="Signout" onPress={logout} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
})