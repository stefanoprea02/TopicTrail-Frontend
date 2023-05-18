import React from "react";
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
    dropdown:{
        fontSize: 18,
        padding: 8,
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5
    }
})