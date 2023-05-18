import React from "react";
import { View,TextInput,Button,StyleSheet,navigation } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { JWTContext } from "../Context";

export default function NewGroup(){
    
    const navigation = useNavigation();
    const {ip,jwt} = React.useContext(JWTContext);
    const [formData, setFormData]= React.useState({
        title: '',
        description: ''
    });

    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    async function handleSubmit(){
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        fetch(`${ip}/group/new`, {
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
        <View>
            <TextInput 
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                style={styles.inputBox}
                placeholder="name"
            />
            <TextInput 
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                style={styles.inputBox}
                placeholder="description"
            />
            <Button onPress={() => handleSubmit()} title="Add Group" />
        </View>
    );

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around'
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