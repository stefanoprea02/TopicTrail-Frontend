import React from "react";
import { ImageBackground, TouchableOpacity, Text } from 'react-native';
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";
import { JWTContext } from "../Context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { getGroupsContainingText } from "../Functions";
import InputError from "../components/InputError";

export default function NewPost(){
    const navigation = useNavigation();
    const {jwt, ip} = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        title: "",
        content: "",
        group: "",
        id: ""
    });
    const [groups, setGroups] = React.useState(null);
    const [error, setErrors] = React.useState(null);

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
        })
        .then((res) => res.json())
        .then((data) => {
            let e = [];
            if(Object.keys(data).length <= 2){
                const entries = Object.entries(data);
                for(let [key, value] of entries){
                    key = key.charAt(0).toUpperCase() + key.slice(1);
                    value = value[0].charAt(0).toLowerCase() + value[0].slice(1);
                    e.push(key + " " + value);
                }
                setErrors(e);
            }else{
                setFormData({
                    title: "",
                    content: "",
                    group: "",
                    id: ""
                });
                setErrors(null);
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'Home'
                    })
                )
            }
        });
    }

    console.log(formData);

    React.useEffect(() => {
        async function fetchData(){
            let groups = await getGroupsContainingText(ip, jwt, "");
            handleChange('group', groups[0].title);
            let groupNames = groups.map(g => {return {value: g.title, label: g.title}});
            setGroups(groupNames);
        }
        fetchData();
    }, []);

    return (
        <ImageBackground source={require("../screens/Background.jpeg")} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TextInput 
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                    style={styles.inputBox1}
                    placeholder="Title"
                />
                <TextInput 
                    value={formData.content}
                    onChangeText={(text) => handleChange('content', text)}
                    style={[styles.inputBox2, {height: 150}]}
                    placeholder="Content"
                    multiline={true}
                />
                {groups && 
                    <Dropdown 
                        selectedValue={formData.group}
                        style={styles.dropdown}
                        onChange={(text) => handleChange('group', text.value)}
                        data={groups}
                        labelField="label"
                        valueField="value"
                        maxHeight={300}
                        value={formData.group}
                    />
                }
            </View>
            {error && <InputError errors={error} />}
            {/* <Button onPress={() => handleSubmit()} title="Add Post" /> */}
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} title="Add Group">
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12,
        textAlignVertical: 'top',
    },
    inputBox1: {
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 5,
        fontSize: 25,
        padding: 30,
        marginTop: 25,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        textAlign:"center",
        width:'90%',
    },
    inputBox2: {
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 25,
        fontSize: 18,
        padding: 60,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        maxHeight: 300,
        width:'90%',
        
    },
    dropdown:{
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 50,
        fontSize: 18,
        padding: 13,
        width:'80%',
        backgroundColor: '#F0F8FF',
        textAlignVertical: 'top',
        textAlign:"center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
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
})