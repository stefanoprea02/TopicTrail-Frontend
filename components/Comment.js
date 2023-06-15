import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { removeComment } from "../Functions";

export default function Comment(props){
    if(props.createdAt[1][0] !== '0' && props.createdAt[1] < 10)
        props.createdAt[1] = "0" + props.createdAt[1];
    return (
        <View style={styles.comment}>
            <View style={styles.topBar}>
                <Text style={styles.username}><Icon name="user"/>{props.username}</Text>
                <Text style={styles.username}>{props.createdAt[2]} {props.createdAt[1]} {props.createdAt[0]}</Text>
            </View>
            <View style={styles.topBar}>
                <Text style={styles.comText}>{props.text}</Text>
                {props.isAuthority &&
                    <TouchableOpacity onPress={() => removeComment(props.ip, props.jwt, props.postId, props.id)}>
                        <Icon name="delete" style={styles.icon}></Icon>
                    </TouchableOpacity>
                }
            </View>
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
        alignItems: 'center',
    },
    username:{
        fontSize: 15
    },
    comText: {
        fontSize: 20
    },
    icon:{
        fontSize: 26
    }
})