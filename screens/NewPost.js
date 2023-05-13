import React from "react";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";
import { JWTContext } from "../Context";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function NewPost(){
    const navigation = useNavigation();
    const {jwt, ip} = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        title: "",
        content: "",
        group: "",
        id: ""
    });

    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    async function handleSubmit(){
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("group", formData.group);
        data.append("id", formData.id);
        fetch(`${ip}/post/new`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: data
        });

        navigation.dispatch(
            CommonActions.navigate({
                name: 'Home'
            })
        )
    }

    return (
        <View style={styles.container}>
            <View>
                <TextInput 
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                    style={styles.inputBox}
                    placeholder="title"
                />
                <TextInput 
                    value={formData.content}
                    onChangeText={(text) => handleChange('content', text)}
                    style={[styles.inputBox, {height: 150}]}
                    placeholder="content"
                    multiline={true}
                />
                <TextInput 
                    value={formData.group}
                    onChangeText={(text) => handleChange('group', text)}
                    style={styles.inputBox}
                    placeholder="group"
                />
            </View>
            <Button onPress={() => handleSubmit()} title="Add Post" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12,
        textAlignVertical: 'top',
    },
})