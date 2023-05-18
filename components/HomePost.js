import React from "react";
import { ImageBackground, TouchableOpacity, Text } from 'react-native';
import { View,TextInput,Button,StyleSheet,navigation } from "react-native";

export default function HomePost(props){
    return (
        <View style={styles.homePost}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.content}>{props.content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    homePost:{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "grey"
    },
    title:{
        fontSize: 25,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
        
    },
    content:{
        color: 'grey',
        fontSize: 18,

    },
})