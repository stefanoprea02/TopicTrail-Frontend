import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Home from "../screens/Home";
import NewPost from "../screens/NewPost";
import NewGroup from "../screens/NewGroup";
import Messages from "../screens/Messages";
import Profile from "../screens/Profile";
const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#293264",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              display: "flex",
              height: 55,
            },
            null,
          ],
          tabBarLabelStyle: {
            fontWeight: "700",
            fontSize: 12,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="NewPost"
          component={NewPost}
          options={{
            tabBarLabel: "New Post",
            tabBarIcon: ({ color }) => (
              <AntDesign name="plussquareo" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="NewGroup"
          component={NewGroup}
          options={{
            tabBarLabel: "New Group",
            tabBarIcon: ({ color }) => (
              <AntDesign name="addusergroup" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Messages}
          options={{
            tabBarLabel: "Messages",
            tabBarIcon: ({ color }) => (
              <AntDesign name="message1" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
