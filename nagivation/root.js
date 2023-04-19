import React from "react";
import AuthenticationTabs from "./authTabs";
import UserTabs from "./userTabs";
import { View, Text } from "react-native";
import { getValueFor } from "../Storage";


export default function Root() {
    const [jwt, setJwt] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isValid, setIsValid] = React.useState(null);

    React.useEffect(() => {
        async function fetchData(){
            const res = await getValueFor();
            setJwt(JSON.parse(res));
        }
        fetchData();
    }, []);

    if(jwt){
        fetch("http://192.168.0.106:8080/api/auth/validate", {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        }).then((response) => response.text())
          .then((data) => {
            setIsValid(data);
            setIsLoading(false);
          });
    }else{
        return <AuthenticationTabs />
    }

    return isLoading ? (
        <View><Text>Loading...</Text></View>
    ) : isValid === "true" ? <UserTabs /> : <AuthenticationTabs /> 
}