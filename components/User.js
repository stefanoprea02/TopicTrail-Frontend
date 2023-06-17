import React from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from "react-native";
import { getGroupsContainingText, getUser, addModerator, removeModerator } from "../Functions";
import { JWTContext } from "../Context";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/AntDesign";

export default function User(props){
    const { ip, jwt } = React.useContext(JWTContext);
    const [user, setUser] = React.useState(null);
    const [moderatingGroups, setModeratingGroups] = React.useState([]);
    const [notModeratingGroups, setNotModeratingGroups] = React.useState([]);
    const [addMod, setAddMod] = React.useState(false);
    const [removeMod, setRemoveMod] = React.useState(false);
    const [selectedAddMod, setSelectedAddMod] = React.useState("None");
    const [selectedRemoveMod, setSelectedRemoveMod] = React.useState("None");
    const [r, setR] = React.useState(false);

    React.useEffect(() => {
        async function fetchData(){
            let u = await getUser(ip, jwt, props.username);
            setUser(u);
            
            let modG = [];
            let notModG = [];
            let groups = await getGroupsContainingText(ip, jwt, "");
            if(groups.length != 0){
                let groupNames = groups.map(g => {return {value: g.title, label: g.title}});
                for(let j = 0; j < groupNames.length; j++){
                    let ok = 0;
                    for(let i = 0; i < u.moderating.length; i++){
                        if(u.moderating[i] == groupNames[j].value){
                            ok = 1;
                        }
                    }
                    if(ok == 1){
                        modG.push(groupNames[j]);
                    }
                    else{
                        notModG.push(groupNames[j]);
                    }
                }
                setModeratingGroups(modG);
                setNotModeratingGroups(notModG);
            }
        }
        fetchData()
    }, [r])

    if(user)
        return (
            <ImageBackground source={require("../components/Background.jpeg")} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.username}><Icon name="user" style={styles.icon}/>{props.username}</Text>
                {props.isAdmin &&
                    <TouchableOpacity style={styles.button} onPress={() => {if(addMod != true){setAddMod(true)}else{setAddMod(false)}}}>
                        <Text style={styles.buttonText}>Toggle add moderator</Text>
                    </TouchableOpacity>
                }
                {addMod == true && 
                    <View style={styles.modalContainer}>
                        <Dropdown 
                            key={"2"}
                            selectedValue={selectedAddMod}
                            style={styles.dropdown}
                            onChange={(text) => setSelectedAddMod(text.value)}
                            data={notModeratingGroups}
                            labelField="label"
                            valueField="value"
                            maxHeight={300}
                            value={selectedAddMod}
                        />
                        <TouchableOpacity style={styles.button} onPress={() => {addModerator(ip, jwt, props.username, selectedAddMod);setR(!r)}}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                }
                {props.isAdmin && 
                    <TouchableOpacity style={styles.button} onPress={() => {if(removeMod != true){setRemoveMod(true)}else{setRemoveMod(false)}}}>
                        <Text style={styles.buttonText}>Toggle remove moderator</Text>
                    </TouchableOpacity>
                }
                {removeMod == true && 
                    <View style={styles.modalContainer}>
                        <Dropdown 
                            key={"1"}
                            selectedValue={selectedRemoveMod}
                            style={styles.dropdown}
                            onChange={(text) => setSelectedRemoveMod(text.value)}
                            data={moderatingGroups}
                            labelField="label"
                            valueField="value"
                            maxHeight={300}
                            value={selectedRemoveMod}
                        />
                        <TouchableOpacity style={styles.button} onPress={() => {removeModerator(ip, jwt, props.username, selectedRemoveMod);setR(!r)}}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                }
                <TouchableOpacity style={styles.button} onPress={() => props.sendMessage(props.username)}>
                    <Text style={styles.buttonText}>Send message</Text>
                </TouchableOpacity>
            </View>
            </ImageBackground>
        )
}

const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        padding: 10
    },
    modalContainer: {
    },
    dropdown:{
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        fontSize: 18,
        padding: 13,
        width: 300,
        backgroundColor: '#F0F8FF',
        textAlignVertical: 'top',
        textAlign:"center",
        marginVertical: 10
    },
    button: {
        backgroundColor: '#4D5B9E',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        width: 300,
        padding: 12
    },
    backgroundImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    username: {
        fontSize: 25,
        alignItems: 'center',
        marginBottom: 10
    },
    icon:{
        fontSize: 18
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});