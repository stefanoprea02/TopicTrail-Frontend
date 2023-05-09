import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
        marginVertical: 5,
        padding: 10
    },
    title:{
        fontSize: 25
    },
    content:{
        color: 'red',
        fontSize: 18
    }
})