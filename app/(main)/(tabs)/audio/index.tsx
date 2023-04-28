import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../../../../src/components/Themed";
import { Link } from "expo-router";
import Monkey from "../../../../src/components/common/svg/Monkey";
import AddBook from "../../../../src/components/common/svg/AddBook";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import TrackPlayer, { Track } from "react-native-track-player";
import { useEffect, useState } from "react";
import AudioLink from "../../../../src/components/audio/AudioLink";

export default function AudioMainScreen() {
  const [files, setFiles] = useState([]);

  //------------------------------------------
  //- READ Available Files
  //------------------------------------------
  const readFileSystem = async () => {
    const filesInSystem = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    console.log("FILES", filesInSystem, FileSystem.documentDirectory);
    return filesInSystem;
  };
  useEffect(() => {
    const getFiles = async () => {
      const files = await readFileSystem();
      setFiles(files);
    };
    getFiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Files</Text>
      <View style={{ borderWidth: 1, padding: 10, width: "100%" }}>
        {files.map((file) => (
          <AudioLink
            key={file}
            title={file}
            linkURI={`./audio/${file}`}
            setFiles={setFiles}
          />
        ))}
      </View>
      <Link href="./audio/addAudioModal">
        <Text>Filter</Text>
      </Link>
      <Link href="./audio/modal">
        <Text>Modal</Text>
      </Link>

      <TouchableOpacity onPress={readFileSystem}>
        <Text>Read File System</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      <TouchableOpacity onPress={() => TrackPlayer.play()}>
        <Monkey />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => TrackPlayer.pause()}>
        <AddBook />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
        <AddBook />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    flexGrow: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
