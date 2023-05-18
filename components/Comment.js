import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Comment(props){
    if(props.createdAt[1][0] !== '0' && props.createdAt[1] < 10)
        props.createdAt[1] = "0" + props.createdAt[1];
    return (
        <View style={styles.comment}>
            <View style={styles.topBar}>
                <Text style={styles.username}>{props.username}</Text>
                <Text style={styles.username}>{props.createdAt[2]} {props.createdAt[1]} {props.createdAt[0]}</Text>
            </View>
            <Text style={styles.comText}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        padding: 10
    },
    topBar:{
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    username:{
        fontSize: 15
    },
    comText: {
        fontSize: 20
    }
})