import React from "react";
import { ImageBackground, TouchableOpacity, Text } from 'react-native';
import { View, TextInput, StyleSheet, Button } from "react-native";
import { JWTContext } from "../Context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import InputError from "../components/InputError";

export default function Register(){
    const { ip } = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: ""
    });
    const [error, setErrors] = React.useState(null);
    const [submited, setSubmited] = React.useState(false);
    const navigation = useNavigation();

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
                            username: "",
                            email: "",
                            password: ""
                        });
                        setErrors(null);
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: 'Login'
                            })
                        )
                    }
                });
            }else{
                console.log("Bad username");
            }
        });

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
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.inputBox2}
                placeholder="email"
            />
            <TextInput 
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                style={styles.inputBox2}
                placeholder="password"
                secureTextEntry={true}
            />
            {error && <InputError errors={error} />}
            {/* <Button onPress={handleSubmit} title="Register" /> */}
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} title="Register">
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            </View>
        </ImageBackground>

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
        marginVertical: 10,
        fontSize: 21,
        padding: 18,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        maxHeight: 300,
        
    },
})