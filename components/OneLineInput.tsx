import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface OneLineInputProps {
  handleSubmit: (input: string) => void;
}

export default function ({ handleSubmit }: OneLineInputProps) {
  const [formData, setFormData] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        value={formData}
        onChangeText={(text) => setFormData(text)}
        style={styles.inputBox}
        placeholder="Send a message"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSubmit(formData);
          setFormData("");
        }}
      >
        <AntDesign style={styles.rightIcon} name="arrowright" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    backgroundColor: "#367CFE",
    borderRadius: 200,
    padding: 12,
  },
  rightIcon: {
    color: "white",
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 30,
    flex: 1,
  },
});
