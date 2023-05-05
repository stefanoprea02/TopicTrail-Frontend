import React from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { JWTContext } from "../Context";

export default function Register(){
    const { ip } = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = React.useState({
        username: [],
        email: [],
        password: []
    });
    const [submited, setSubmited] = React.useState(false);

    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    function handleSubmit(){
        fetch(`${ip}/api/auth/checkUsername/` + formData.username)
        .then((response) => response.json())
        .then((data) => {
            if(data === false){
                const data = new FormData();
                data.append("username", formData.username);
                data.append("email", formData.email);
                data.append("password", formData.password);
                fetch(`${ip}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: data
                })
                .then((response) => response.json())
                .then((data) => console.log(data))
            }else{
                console.log("Bad username");
            }
        });

        setSubmited(true);
    }

    return (
        <View>
            <TextInput 
                value={formData.username}
                onChangeText={(text) => handleChange('username', text)}
                style={styles.inputBox}
                placeholder="username"
            />
            <TextInput 
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.inputBox}
                placeholder="email"
            />
            <TextInput 
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                style={styles.inputBox}
                placeholder="password"
            />
            <Button onPress={handleSubmit} title="Register" />
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
        padding: 12
    }
})