import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { JWTContext } from "../Context";
import InputError from "../components/InputError";
import {
  approveGroup,
  disapproveGroup,
  getUnapprovedGroups,
  isAdmin,
} from "../Functions";
import { AntDesign } from "react-native-vector-icons";
import ActionButton from "../components/ActionButton";

export default function NewGroup() {
  const navigation = useNavigation();
  const { ip, jwt } = React.useContext(JWTContext);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
  });
  const [error, setErrors] = React.useState(null);
  const [unapprovedGroups, setUnapprovedGroups] = React.useState(null);
  const [r, setR] = React.useState(false);
  const [userIsAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      let a = await isAdmin(ip, jwt);
      setIsAdmin(a);
      if (a)
        setTimeout(() => {
          async function w() {
            let g = await getUnapprovedGroups(ip, jwt);
            setUnapprovedGroups(g);
          }
          w();
        }, 500);
    }
    fetchData();
  }, [r, isAdmin]);

  function handleChange(field, text) {
    setFormData({ ...formData, [field]: text });
  }

  async function handleSubmit() {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    fetch(`${ip}/group/new`, {
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
        setR(!r);
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
            description: "",
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

  const renderUnapprovedGroups = ({ item }) => {
    return (
      <View style={styles.group}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => {
            approveGroup(ip, jwt, item.title);
            setR(!r);
          }}
        >
          <AntDesign name="check" style={styles.icon}></AntDesign>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            disapproveGroup(ip, jwt, item.id);
            setR(!r);
          }}
        >
          <AntDesign name="close" style={styles.icon}></AntDesign>
        </TouchableOpacity>
      </View>
    );
  };

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
            placeholder="Group Name"
          />
          <TextInput
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            style={styles.inputBoxMultiline}
            placeholder="Description"
            multiline={true}
          />
        </View>
        {error && <InputError errors={error} />}
        <View style={styles.groupList}>
          {userIsAdmin && (
            <FlatList
              data={unapprovedGroups}
              renderItem={renderUnapprovedGroups}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
        <ActionButton actionName="Create group" onSubmit={handleSubmit} />
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
  group: {
    flexDirection: "row",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  icon: {
    fontSize: 40,
    color: "#367CFE",
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  groupList: {
    height: "30%",
  },
});
