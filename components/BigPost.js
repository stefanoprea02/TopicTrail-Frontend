import React from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import { JWTContext } from "../Context";
import Comment from "./Comment";
import AntDesign from "react-native-vector-icons/AntDesign"

export default function BigPost(props) {
    const { ip, jwt } = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        content: ""
    });
    const [comments, setComments] = React.useState(null);
    const [aux, setAux] = React.useState(false);

    function handleChange(field, text) {
        setFormData({ ...formData, [field]: text });
    }

    React.useEffect(() => {
        async function fetchData() {
            let comments = await fetch(`${ip}/post/${props.id}/comment`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then((response) => response.json())
                .then((data) => data);
            setComments(comments);
        }
        fetchData();
    }, [aux]);

    function handleSubmit() {
        const data = new FormData();
        data.append("text", formData.content);
        fetch(`${ip}/post/${props.id}/comment/new`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: data
        })
        .then((response) => response.json())
        .then((data) => {
            setFormData({ ...formData, ['content']: "" });
            setAux(!aux);
        });
    }

    const renderComments = ({ item }) => {
        return (
            <Comment text={item.text} username={item.username} createdAt={item.createdAt} />
        )
    }

    return (
        <ImageBackground source={require("../components/Background.jpeg")} style={styles.backgroundImage}>
        <View style={styles.container}>
        <View style={styles.homePost}>
            <View style={styles.postDetails}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.content}>{props.content}</Text>
            </View>
            {comments && 
                <FlatList 
                    data={comments}
                    renderItem={renderComments}
                    keyExtractor={(item) => item.id}
                />
            }
            <View style={styles.commentInput}>
                <TextInput
                    value={formData.content}
                    onChangeText={(text) => handleChange('content', text)}
                    style={styles.inputBox}
                    placeholder="Add a new comment"
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <AntDesign name="right" style={styles.icon}></AntDesign>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    homePost: {
        marginVertical: 5,
        padding: 10,
        flex: 1,
        justifyContent: 'space-between'
    },
    title:{
        fontSize: 35,
        textAlign: "center",
        marginBottom: 15,
        
    },

    postDetails:{
        marginBottom: 10
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12,
        width: '85%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        padding: 6
    },
    icon: {
        fontSize: 39
    },
    commentInput: {

        flexDirection: "row",
        justifyContent: 'down',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-around'
    },
    content:{
        color: 'black',
        fontSize: 21,
        borderTopWidth: 20,
        borderBottomWidth: 40,
        borderColor: 'black',

    },
})