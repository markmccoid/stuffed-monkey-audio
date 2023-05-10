import { Pressable, StyleSheet, Image, Button } from "react-native";

import { Text, View } from "../../../../src/components/Themed";
import { Link } from "expo-router";
import Monkey from "../../../../src/components/common/svg/Monkey";
import AddBook from "../../../../src/components/common/svg/AddBook";
import * as FileSystem from "expo-file-system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// import { Base64 } from "../../../../src/utils/base64";
const base64 = require("base-64");

import { readFileSystemDir } from "../../../../src/store/data/fileSystemAccess";
import TrackContainer from "../../../../src/components/tracks/TrackContainer";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

export default function AudioMainScreen() {
  const [files, setFiles] = useState([]);
  const [albumPic, setAlbumPic] = useState(undefined);

  //! -------------------
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  //! -------------------
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
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Link href="./audio/modal">
          <Text>Modal</Text>
        </Link>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        bottomInset={46}
        // set `detached` to true
        detached={true}
        style={{ marginHorizontal: 50 }}
      >
        <View className="flex-1 items-center bg-gray-200  justify-center">
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
