import React from "react";
import { View,TextInput,Button } from "react-native";
import { JWTContext } from "../Context";


export default function NewGroup(){
    
    const {ip,jwt} = React.useContext(JWTContext);
    const [formData, setFormData]= React.useState({
        title: ''
    });

    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    async function handleSubmit(){
        const data = new FormData();
        data.append("title", formData.title);
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
            <Button onPress={() => handleSubmit()} title="Add Group" />
        </View>
    );
}