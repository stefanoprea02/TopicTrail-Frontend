import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";

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
          console.log(response);
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
        <TextInput
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
          style={styles.inputBox2}
          placeholder="username"
          autoCapitalize="none"
        />
        <TextInput
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          style={styles.inputBox2}
          placeholder="password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  inputBox: {
    borderColor: "#4D5B9E",
    borderWidth: 0.2,
    marginVertical: 5,
    fontSize: 18,
    padding: 12,
  },
  button: {
    backgroundColor: "#4D5B9E",
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
    marginLeft: 35,
    marginRight: 35,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputBox2: {
    borderColor: "#4D5B9E",
    borderWidth: 0.5,
    marginVertical: 25,
    fontSize: 21,
    padding: 18,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: "#F0FFFF",
    textAlignVertical: "top",
    maxHeight: 300,
  },
});
