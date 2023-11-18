import React from "react";
import { Text, StyleSheet, View } from "react-native";

export default function InputError(props) {
  let errors = [];
  errors = props.errors.map((e) => {
    return (
      <Text key={e} style={styles.errorText}>
        {e}
      </Text>
    );
  });

  return <View style={styles.errorBox}>{errors}</View>;
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    marginVertical: 3,
    color: "white",
  },
  errorBox: {
    backgroundColor: "#E68587",
    borderWidth: 1,
    borderColor: "#F5C6CB",
    color: "#721C24",
    padding: 10,
    marginVertical: 5,
  },
});
