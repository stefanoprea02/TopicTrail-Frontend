import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useState, useContext, useEffect } from "react";
import { JWTContext } from "../Context";
import {
  addModerator,
  getGroupsContainingText,
  isAdmin,
  removeModerator,
} from "../Functions";
import { Dropdown } from "react-native-element-dropdown";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { save } from "../Storage";

interface ProfileModActionProps {
  user: User;
  contentType: "Posts" | "Comments" | "Favorites" | "Groups";
  setContentType: (
    value: "Posts" | "Comments" | "Favorites" | "Groups"
  ) => void;
}

export default function ProfileModalActions(props: ProfileModActionProps) {
  const { jwt, setJwt, ip, username, setUsername } = useContext(JWTContext);
  const [userIsAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [moderatingGroups, setModeratingGroups] = useState([]);
  const [notModeratingGroups, setNotModeratingGroups] = useState([]);
  const [addMod, setAddMod] = useState(false);
  const [removeMod, setRemoveMod] = useState(false);
  const [selectedAddMod, setSelectedAddMod] = useState("None");
  const [selectedRemoveMod, setSelectedRemoveMod] = useState("None");
  const navigation = useNavigation();

  async function reloadUser() {
    let a = await isAdmin(ip, jwt);
    setIsAdmin(a);

    let modG = [];
    let notModG = [];
    let groups = await getGroupsContainingText(ip, jwt, "");

    if (groups.length !== 0) {
      let groupNames = groups.map((g) => ({ value: g.title, label: g.title }));

      for (let groupName of groupNames) {
        let isModerating = props.user.moderating.includes(groupName.value);

        if (isModerating) {
          modG.push(groupName);
        } else {
          notModG.push(groupName);
        }
      }

      setModeratingGroups(modG);
      setNotModeratingGroups(notModG);
    }
  }

  const sendMessage = (username: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "Messages",
        params: {
          name: props.user.username,
        },
      })
    );
  };

  useEffect(() => {
    reloadUser();
  }, []);

  function logout() {
    setJwt("");
    setUsername("");
    save("", "");
  }

  if (userIsAdmin === null) return <></>;

  return (
    <View style={styles.container}>
      {userIsAdmin && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (addMod != true) {
              setAddMod(true);
            } else {
              setAddMod(false);
            }
          }}
        >
          <Text style={styles.buttonText}>Toggle add moderator</Text>
        </TouchableOpacity>
      )}
      {addMod == true && (
        <>
          <Dropdown
            key={"2"}
            style={styles.dropdown}
            onChange={(text) => setSelectedAddMod(text.value)}
            data={notModeratingGroups}
            labelField="label"
            valueField="value"
            maxHeight={300}
            value={selectedAddMod}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              addModerator(ip, jwt, props.user.username, selectedAddMod);
              reloadUser();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
      {userIsAdmin && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (removeMod != true) {
              setRemoveMod(true);
            } else {
              setRemoveMod(false);
            }
          }}
        >
          <Text style={styles.buttonText}>Toggle remove moderator</Text>
        </TouchableOpacity>
      )}
      {removeMod == true && (
        <>
          <Dropdown
            key={"1"}
            style={styles.dropdown}
            onChange={(text) => setSelectedRemoveMod(text.value)}
            data={moderatingGroups}
            labelField="label"
            valueField="value"
            maxHeight={300}
            value={selectedRemoveMod}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              removeModerator(ip, jwt, props.user.username, selectedRemoveMod);
              reloadUser();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => sendMessage(props.user.username)}
      >
        <Text style={styles.buttonText}>Send message</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setContentType("Comments")}
      >
        <Text style={styles.buttonText}>Show comments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setContentType("Posts")}
      >
        <Text style={styles.buttonText}>Show posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setContentType("Favorites")}
      >
        <Text style={styles.buttonText}>Show favorite posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => props.setContentType("Groups")}
      >
        <Text style={styles.buttonText}>Show groups</Text>
      </TouchableOpacity>

      {props.user.username === username && (
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: "80%",
  },
  button: {
    backgroundColor: "#367CFE",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 6,
    width: "80%",
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
