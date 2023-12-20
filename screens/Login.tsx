import React from "react";
import { Image, ImageBackground, TouchableOpacity } from "react-native";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";
import { AntDesign } from "react-native-vector-icons";
import ActionButton from "../components/ActionButton";

export default function Login() {
  const { setJwt, ip } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    username: "admin",
    password: "admin",
  });

  function handleChange(field: string, text: string) {
    setFormData({ ...formData, [field]: text });
  }

  function handleSubmit() {
    const data = new FormData();
    data.append("username", formData.username);
    data.append("password", formData.password);

    try {
      fetch(`${ip}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: data,
      })
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          setJwt(data);
          save(data, formData.username);
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/login-high-resolution-logo-white-transparent.png")}
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
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            style={styles.inputBox}
            placeholder="password"
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
        <ActionButton actionName="Sign in" onSubmit={handleSubmit} />
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
    gap: 60,
    marginTop: "20%",
  },
  loginImage: {
    width: 200,
    height: 150,
    alignSelf: "flex-start",
    marginBottom: 40,
  },
  loginContainer: {
    width: "90%",
    gap: 20,
    marginTop: 85.6,
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
  },
});
