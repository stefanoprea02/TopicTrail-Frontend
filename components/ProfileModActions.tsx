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

interface ProfileModActionProps {
  user: User;
  contentType: "Posts" | "Comments";
  setContentType: (value: "Posts" | "Comments") => void;
}

export default function ProfileModalActions(props: ProfileModActionProps) {
  const { jwt, ip } = useContext(JWTContext);
  const [userIsAdmin, setIsAdmin] = useState(false);
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
        onPress={() =>
          props.setContentType(
            props.contentType === "Posts" ? "Comments" : "Posts"
          )
        }
      >
        <Text style={styles.buttonText}>
          Show {props.contentType === "Posts" ? "comments" : "posts"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  dropdown: {
    borderColor: "#4D5B9E",
    borderWidth: 0.5,
    fontSize: 18,
    padding: 13,
    width: 300,
    backgroundColor: "#F0F8FF",
    textAlignVertical: "top",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4D5B9E",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: 300,
    padding: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
