import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { JWTContext } from "../Context";

export default function BigPost(props) {
    const { ip, jwt } = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        content: ""
    });
    const [comments, setComments] = React.useState(null);

    function handleChange(field, text) {
        setFormData({ ...formData, [field]: text });
    }

    React.useEffect(() => {
        async function fetchData() {
            let comments = await fetch(`${ip}/comments/all/${props.id}`, {
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
    }, []);

    function handleSubmit() {
        const data = new FormData();
        data.append("content", formData.content);
        fetch(`${ip}/comment/new/${props.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: data
        })
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
            });
    }

    return (
        <View style={styles.homePost}>
            <View>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.content}>{props.content}</Text>
            </View>
            <View>
                <TextInput
                    value={formData.content}
                    onChangeText={(text) => handleChange('content', text)}
                    style={styles.inputBox}
                    placeholder="content"
                />
                <Button onPress={handleSubmit} title="New Comment" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homePost: {
        marginVertical: 5,
        padding: 10,
        flex: 1,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 25
    },
    content: {
        color: 'red',
        fontSize: 18
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12
    },
    icon: {
        fontSize: 40
    }
})