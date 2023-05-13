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
        padding: 15,
        borderBottomWidth: 0.2,
        borderBottomColor: "grey"
    },
    title:{
        fontSize: 25
    },
    content:{
        color: 'red',
        fontSize: 18
    }
})