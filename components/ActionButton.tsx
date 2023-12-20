import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "react-native-vector-icons";

interface ActionButtonProps {
  actionName: string;
  onSubmit: () => void;
}

export default function ActionButton(props: ActionButtonProps) {
  return (
    <View style={styles.actionContainer}>
      <Text style={styles.actionText}>{props.actionName}</Text>
      <TouchableOpacity style={styles.button} onPress={props.onSubmit}>
        <AntDesign style={styles.rightIcon} name="arrowright" size={40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  actionText: {
    color: "black",
    fontSize: 32,
    fontWeight: "900",
  },
  button: {
    backgroundColor: "#367CFE",
    borderRadius: 200,
    padding: 12,
  },
  rightIcon: {
    color: "white",
  },
});
