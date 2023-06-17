import React from "react";
import { ImageBackground, TouchableOpacity } from 'react-native';
import { View, Text, TextInput, TouchableWithoutFeedback, Animated, StyleSheet, Button } from "react-native";
import { save, getValueFor } from "../Storage";
import { JWTContext } from "../Context";

export default function Login(){
    const {setJwt, ip} = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        username: "Stefan",
        password: "Stefan"
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
        console.log("DA");
        const data = new FormData();
        data.append("username", formData.username);
        data.append("password", formData.password);
        fetch(`${ip}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: data
        })
        .then((response) => response.text())
        .then((data) => {
            setJwt(data);
            save(data);
        })

        setSubmited(true);
    }

    return (
        <ImageBackground source={require("../screens/Background.jpeg")} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TextInput 
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
                    style={styles.inputBox2}
                    placeholder="username"
                />
                <TextInput 
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    style={styles.inputBox2}
                    placeholder="password"
                    secureTextEntry={true}
                />
                {/* <Button onPress={handleSubmit} title="Login" /> */}
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} title="Login">
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 10,
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12
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
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      inputBox2: {
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 25,
        fontSize: 21,
        padding: 18,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        maxHeight: 300,
        
    },
})





