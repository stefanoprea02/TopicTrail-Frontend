import React from "react";
import { Image, ImageBackground } from "react-native";
import { View, TextInput, StyleSheet } from "react-native";
import { save } from "../Storage";
import { JWTContext } from "../Context";
import ActionButton from "../components/ActionButton";
import InputError from "../components/InputError";

export default function Login() {
  const { setJwt, ip, setUsername } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    username: "admin",
    password: "admin",
  });
  const [error, setErrors] = React.useState(null);

  function handleChange(field: string, text: string) {
    setFormData({ ...formData, [field]: text });
  }

  async function handleSubmit() {
    const data = new FormData();
    data.append("username", formData.username);
    data.append("password", formData.password);

    try {
      await fetch(`${ip}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: data,
      })
        .then((response) => {
          if (response.status === 200) return response.text();
          else throw new Error("Bad credentials");
        })
        .then((data) => {
          setJwt(data);
          setUsername(formData.username);
          save(data, formData.username);
          return data;
        });
    } catch (err) {
      setErrors(err.message);
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
          {error && <InputError errors={[error]} />}
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
    marginTop: "15%",
    justifyContent: "space-between",
  },
  loginImage: {
    width: "60%",
    height: "25%",
    alignSelf: "flex-start",
  },
  loginContainer: {
    width: "90%",
    gap: 20,
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
  },
});
