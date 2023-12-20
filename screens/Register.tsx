import React from "react";
import { ImageBackground, TouchableOpacity, Text, Image } from "react-native";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { JWTContext } from "../Context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import InputError from "../components/InputError";
import { AntDesign } from "react-native-vector-icons";
import ActionButton from "../components/ActionButton";

export default function Register() {
  const { ip } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setErrors] = React.useState(null);
  const [submited, setSubmited] = React.useState(false);
  const navigation = useNavigation();

  function handleChange(field, text) {
    setFormData({ ...formData, [field]: text });
  }

  function handleSubmit() {
    fetch(`${ip}/api/auth/checkUsername/` + formData.username)
      .then((response) => response.json())
      .then((data) => {
        if (data === false) {
          const data = new FormData();
          data.append("username", formData.username);
          data.append("email", formData.email);
          data.append("password", formData.password);
          fetch(`${ip}/api/auth/register`, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              let e = [];
              if (Object.keys(data).length <= 2) {
                const entries = Object.entries(data);
                for (let [key, value] of entries) {
                  key = key.charAt(0).toUpperCase() + key.slice(1);
                  value = value[0].charAt(0).toLowerCase() + value[0].slice(1);
                  e.push(key + " " + value);
                }
                setErrors(e);
              } else {
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                });
                setErrors(null);
                navigation.dispatch(
                  CommonActions.navigate({
                    name: "Login",
                  })
                );
              }
            });
        } else {
          console.log("Bad username");
        }
      });

    setSubmited(true);
  }

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/register-high-resolution-logo-white-transparent.png")}
          style={styles.loginImage}
        />
        <View style={styles.loginContainer}>
          <TextInput
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            style={styles.inputBox}
            placeholder="username"
            autoCapitalize="none"
          />
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            style={styles.inputBox}
            placeholder="email"
            autoCapitalize="none"
          />
          <TextInput
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            style={styles.inputBox}
            placeholder="password"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {error && <InputError errors={error} />}
        </View>
        <ActionButton actionName="Sign up" onSubmit={handleSubmit} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "110%",
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    marginTop: "15%",
  },
  loginImage: {
    width: "60%",
    height: "25%",
    alignSelf: "flex-start",
  },
  loginContainer: {
    width: "90%",
    marginTop: "20%",
    marginBottom: "20%",
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
    marginTop: "5%",
  },
});
