import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { JWTContext } from "../Context";

export default function BigPost(props){
    const {ip, jwt} = React.useContext(JWTContext);
    const [formData, setFormData] = React.useState({
        content: ""
    });
    const [comments, setComments] = React.useState(null);

    const [favorite,setFavorite] = React.useState(false);


    function handleChange(field, text){
        setFormData({...formData, [field]: text});
    }

    React.useEffect(() => {
        async function fetchData(){
            let comments = await fetch(`${ip}/comments/all/${props.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            })
            .then((response) => response.json())
            .then((data) => data);
            setComments(comments);
        }
        fetchData();
    }, []);

    function handleSubmit(){
        const data = new FormData();
        data.append("content", formData.content);
        fetch(`${ip}/comment/new/${props.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: data
        })
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
        });
    }
    
    async function checkFavorite(){
        fetch(`${ip}/post/checkFavorite/${props.id}`, {
        method : 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
        }
        ) . then( ( response ) => response.json() ) 
         .then( (data) => setFavorite(data) )
    }

    React.useEffect(() => {
        async function fetchData(){
            let fav = await checkFavorite();
            setFavorite(fav);
        }
        fetchData();
    }, [])

    async function adFavorite(){
        console.log(props.id);
        fetch(`${ip}/post/adFavorite/${props.id}`, {
            method : 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            }
            }
            ) . then( ( response ) => response.json() ) 
             .then( (data) => data )
    }

    async function removeFavorite(){
        fetch(`${ip}/post/removeFavorite/${props.id}`, {
            method : 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            }
            }
            ) . then( ( response ) => response.json() ) 
             .then( (data) => data )
    }
    

    return (
        <View style={styles.homePost}>
            <View>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.content}>{props.content}</Text>
            </View>
            <View>
                <TextInput 
                    value={formData.content}
                    onChangeText={(text) => handleChange('content', text)}
                    style={styles.inputBox}
                    placeholder="content"
                />
                {favorite ? <Button title="Mark as favorite" onPress={async() => {await adFavorite(); setFavorite(true)}}></Button> 
                : <Button title="Unmark" onPress={async() => {await removeFavorite(); setFavorite(false)}}></Button>}
                <Button onPress={handleSubmit} title="New Comment" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homePost:{
        marginVertical: 5,
        padding: 10,
        flex: 1,
        justifyContent: 'space-between'
    },
    title:{
        fontSize: 25
    },
    content:{
        color: 'red',
        fontSize: 18
    },
    inputBox: {
        borderColor: '#4D5B9E',
        borderWidth: 0.2,
        marginVertical: 5,
        fontSize: 18,
        padding: 12
    }
})