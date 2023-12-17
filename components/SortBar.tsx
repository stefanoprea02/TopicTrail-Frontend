import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface SortBarProps {
  handleSortByTitle: () => void;
  handleSortByDate: () => void;
  sortByTitleAscending: boolean;
  sortByDateAscending: boolean;
}

export default function SortBar(props: SortBarProps) {
  return (
    <View style={styles.sortBar}>
      <TouchableOpacity
        onPress={props.handleSortByTitle}
        style={styles.sortButton}
      >
        <Text
          style={{
            marginRight: 5,
            fontSize: 17,
            color: "#4D5B9E",
            fontWeight: "bold",
          }}
        >
          Sort by Title
        </Text>
        <FontAwesome
          name={props.sortByTitleAscending ? "caret-up" : "caret-down"}
          size={18}
          color="#4D5B9E"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.handleSortByDate}
        style={styles.sortButton}
      >
        <Text
          style={{
            marginRight: 5,
            fontSize: 17,
            color: "#4D5B9E",
            fontWeight: "bold",
          }}
        >
          Sort by Date
        </Text>
        <FontAwesome
          name={props.sortByDateAscending ? "caret-up" : "caret-down"}
          size={18}
          color="#4D5B9E"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sortBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 30,
  },
  sortButton: {
    fontSize: 16,
    color: "#4D5B9E",
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
