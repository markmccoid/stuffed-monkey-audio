import { StyleSheet } from "react-native";

import { Text, View } from "../../../../src/components/Themed";
import { Link } from "expo-router";
import Monkey from "../../../../src/components/common/svg/Monkey";
import AddBook from "../../../../src/components/common/svg/AddBook";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Files</Text>

      <Link href="./audio/addAudioModal">
        <Text>Filter</Text>
      </Link>
      <Monkey />
      <AddBook />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
