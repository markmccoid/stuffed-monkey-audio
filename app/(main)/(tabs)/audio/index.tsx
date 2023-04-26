import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../../../../src/components/Themed";
import { Link } from "expo-router";
import Monkey from "../../../../src/components/common/svg/Monkey";
import AddBook from "../../../../src/components/common/svg/AddBook";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import TrackPlayer from "react-native-track-player";

export default function TabOneScreen() {
  const addTrack = () => {
    TrackPlayer.add({
      id: "1",
      url: "https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3",
      // url: "file:///Users/markmccoid/Library/Developer/CoreSimulator/Devices/4B118E07-68F3-4688-80A9-3DDB0FEC9AE4/data/Containers/Data/Application/77A5067A-BF09-415E-8593-C76CEE52CF85/Documents/funk.mp3",
      title: "Keys of moon",
      artist: "The Epic Hero",
      artwork: "https://picsum.photos/id/1003/200/300",
      album: "",
      duration: 149,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Files</Text>

      <Link href="./audio/addAudioModal">
        <Text>Filter</Text>
      </Link>
      <Link href="./audio/modal">
        <Text>Modal</Text>
      </Link>
      <TouchableOpacity onPress={addTrack}>
        <Text>Add Track</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => TrackPlayer.play()}>
        <Monkey />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => TrackPlayer.pause()}>
        <AddBook />
      </TouchableOpacity>
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
