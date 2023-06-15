import React from "react";
import { ImageBackground, TouchableOpacity, Text, FlatList, View, TextInput, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from "@react-navigation/native";
import { JWTContext } from "../Context";
import InputError from "../components/InputError";
import { approveGroup, disapproveGroup, getUnapprovedGroups, isAdmin } from "../Functions";
import Icon from "react-native-vector-icons/AntDesign";

export default function NewGroup(){
    const navigation = useNavigation();
    const {ip,jwt} = React.useContext(JWTContext);
    const [formData, setFormData]= React.useState({
        title: '',
        description: ''
    });
    const [error, setErrors] = React.useState(null);
    const [unapprovedGroups, setUnapprovedGroups] = React.useState(null);
    const [r, setR] = React.useState(false);
    const [userIsAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        async function fetchData(){
            let a = await isAdmin(ip, jwt);
            setIsAdmin(a);
            if(a)
                setTimeout(() => {
                    async function w(){
                        let g = await getUnapprovedGroups(ip, jwt);
                        setUnapprovedGroups(g);
                    }
                    w();
                }, 500)
        }
        fetchData();
    }, [r, isAdmin])

    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    async function handleSubmit(){
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        fetch(`${ip}/group/new`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: data
        })
        .then((res) => res.json())
        .then((data) => {
            let e = [];
            setR(!r)
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
                    title: '',
                    description: ''
                });
                setErrors(null);
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'Home'
                    })
                )
            }
        });
    }

    const renderUnapprovedGroups = ({item}) => {
        return (
            <View style={styles.group}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => {approveGroup(ip, jwt, item.title); setR(!r)}}>
                    <Icon name="check" style={styles.Icon}></Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {disapproveGroup(ip, jwt, item.id); setR(!r)}}>
                    <Icon name="close" style={styles.Icon}></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ImageBackground source={require("../screens/Background.jpeg")} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TextInput 
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                    style={styles.inputBox1}
                    placeholder="Group Name"

                />
                <TextInput 
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                    style={styles.inputBox2}
                    placeholder="Description"
                    multiline={true}
                />
                {error && <InputError errors={error} />}
                {/* <Button onPress={() => handleSubmit()} title="Add Group" style={styles.button} /> */}
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} title="Add Group">
                    <Text style={styles.buttonText}>Add Group</Text>
                </TouchableOpacity>
                {userIsAdmin && <FlatList
                    data={unapprovedGroups}
                    renderItem={renderUnapprovedGroups}
                    keyExtractor={(item) => item.id} 
                />}
            </View>
        </ImageBackground>
    );

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around'
    },
    inputBox1: {
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 5,
        fontSize: 25,
        padding: 30,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        textAlign:"center",
    },
    inputBox2: {
        borderColor: '#4D5B9E',
        borderWidth: 0.5,
        marginVertical: 5,
        fontSize: 18,
        padding: 60,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#F0FFFF',
        textAlignVertical: 'top',
        maxHeight: 300,
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
        marginBottom: 10
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      group: {
        flexDirection: "row",
        margin: 5,
        justifyContent: "center",
        alignItems: "center"
      },
      title: {
        fontSize: 20,
        paddingHorizontal: 10,
      },
      Icon: {
        fontSize: 40,
        color: '#4D5B9E',
      },
})