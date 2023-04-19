import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Login from "../screens/Login";
import Register from "../screens/Register";
const Tab = createBottomTabNavigator();

export default function AuthenticationTabs(){
    return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: true,
              "tabBarActiveTintColor": "#293264",
              "tabBarInactiveTintColor": "gray",
              "tabBarLabelStyle": {
                  "fontSize": 14,
                  "fontWeight": "bold",
                  "marginBottom": 4
              },
              "tabBarStyle": [
                  {
                    "display": "flex",
                    "padding": 5,
                    "height": 55
                  },
                  null
              ]
            }}
          >
            <Tab.Screen
              name="Login"
              component={Login}
              options={{
                tabBarLabel: "Login",
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="sign-in" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Register"
              component={Register}
              options={{
                tabBarLabel: "Register",
                tabBarIcon: ({ color }) => (
                  <AntDesign name="idcard" size={24} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
}