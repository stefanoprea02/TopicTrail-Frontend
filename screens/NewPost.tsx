import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { JWTContext } from "../Context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { getGroupsContainingText } from "../Functions";
import InputError from "../components/InputError";
import ActionButton from "../components/ActionButton";

export default function NewPost() {
  const navigation = useNavigation();
  const { jwt, ip } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
    group: "",
    id: "",
  });
  const [groups, setGroups] = React.useState(null);
  const [error, setErrors] = React.useState(null);

  function handleChange(field: string, text: string) {
    setFormData({ ...formData, [field]: text });
  }

  async function handleSubmit() {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("group", formData.group);
    data.append("id", formData.id);
    console.log(formData);
    fetch(`${ip}/post/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
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
            title: "",
            content: "",
            group: "",
            id: "",
          });
          setErrors(null);
          navigation.dispatch(
            CommonActions.navigate({
              name: "Home",
            })
          );
        }
      });
  }

  React.useEffect(() => {
    async function fetchData() {
      let groups = await getGroupsContainingText(ip, jwt, "");
      if (groups.length != 0) {
        handleChange("group", groups[0].title);
        let groupNames = groups.map((g) => {
          return { value: g.title, label: g.title };
        });
        setGroups(groupNames);
      }
    }
    fetchData();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/Background.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            value={formData.title}
            onChangeText={(text) => handleChange("title", text)}
            style={styles.inputBox}
            placeholder="Title"
          />
          <TextInput
            value={formData.content}
            onChangeText={(text) => handleChange("content", text)}
            style={[styles.inputBoxMultiline, { height: 150 }]}
            placeholder="Content"
            multiline={true}
          />
          {groups && (
            <Dropdown
              style={styles.dropdown}
              onChange={(text) => handleChange("group", text.value)}
              data={groups}
              labelField="label"
              valueField="value"
              maxHeight={300}
              value={formData.group}
            />
          )}
        </View>
        {error && <InputError errors={error} />}
        <ActionButton actionName="Create post" onSubmit={handleSubmit} />
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
    marginTop: "30%",
    alignItems: "center",
    gap: 60,
  },
  inputContainer: {
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
  inputBoxMultiline: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
    height: 200,
    textAlignVertical: "top",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 19,
    paddingHorizontal: 30,
  },
});
