import { Pressable, StyleSheet, Image } from "react-native";

import { Text, View } from "../../../../src/components/Themed";
import { Link } from "expo-router";
import Monkey from "../../../../src/components/common/svg/Monkey";
import AddBook from "../../../../src/components/common/svg/AddBook";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

// import { Base64 } from "../../../../src/utils/base64";
const base64 = require("base-64");

import { useTracksStore, useTrackActions } from "../../../../src/store/store";
import { readFileSystemDir } from "../../../../src/store/data/fileSystemAccess";
import { TouchableOpacity } from "react-native-gesture-handler";
import TrackContainer from "../../../../src/components/tracks/TrackContainer";
import AudioLink from "../../../../src/components/tracks/AudioLink";

export default function AudioMainScreen() {
  const [files, setFiles] = useState([]);
  const [albumPic, setAlbumPic] = useState(undefined);

  //------------------------------------------
  //- READ Available Files
  //------------------------------------------
  useEffect(() => {
    const getFiles = async () => {
      const files = await readFileSystemDir();
      setFiles(files);
    };
    getFiles();
  }, []);

  return (
    <View style={styles.container}>
      <Link href="./audio/modal">
        <Text>Modal</Text>
      </Link>

      <Text style={styles.title}>Audio Files</Text>
      <TrackContainer />
      {/* Shows files stored in system direcotry */}
      {/* <View style={{ borderWidth: 1, padding: 10, width: "100%" }}>
        {files.map((file) => (
          <AudioLink
            key={file}
            title={file}
            linkURI={`./audio/${file}`}
            setFiles={setFiles}
          />
        ))}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
