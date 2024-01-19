import { StyleSheet, Text, View } from "react-native";

interface ProfileGroupProps {
  group: Group;
}

export default function ProfileGroup({ group }: ProfileGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#367CFE",
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});
