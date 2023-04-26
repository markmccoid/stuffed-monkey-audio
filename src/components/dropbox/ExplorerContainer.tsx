import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  listDropboxFiles,
  DropboxDir,
  FileEntry,
  downloadDropboxFile,
} from "../../utils/dropboxUtils";
import BrowserActionBar from "./ExplorerActionBar";
import { Link } from "expo-router";
import { FileAudioIcon, FolderClosedIcon } from "../common/svg/Icons";

import * as FileSystem from "expo-file-system";

const ExplorerContainer = () => {
  const [files, setFiles] = React.useState<DropboxDir>();
  const [currentPath, setCurrentPath] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(undefined);

  const testDownload = async (file: FileEntry) => {
    if (file.name.includes("mp3") || file.name.includes("txt")) {
      const download = await downloadDropboxFile(file.path_lower);
      // Get the document directory URI
      let documentDirectoryUri = FileSystem.documentDirectory + file.name;

      // Write the contents of newFile to the document directory
      await FileSystem.writeAsStringAsync(documentDirectoryUri, download, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log("DOWNLOAD and DONE SAVING", documentDirectoryUri);
    }
  };
  React.useEffect(() => {
    const getFiles = async () => {
      setIsLoading(true);
      try {
        const files = await listDropboxFiles(currentPath);
        setFiles(files);
      } catch (err) {
        console.log(err);
        setIsError(err.cause);
      }
      setIsLoading(false);
    };

    getFiles();
  }, [currentPath]);
  const onNavigateForward = (nextPath: string) => {
    console.log("next", nextPath);
    setCurrentPath(nextPath);
  };

  if (isError) {
    return (
      <View>
        <Text>Error: {isError}</Text>
        {isError === "Dropbox" && (
          <Link href="/settings/dropboxSetup">
            <Text>Go To Dropbox Authorization Page</Text>
          </Link>
        )}
      </View>
    );
  }
  return (
    <View>
      <View style={{ zIndex: 5 }}>
        <BrowserActionBar
          currentPath={currentPath}
          onHandleBack={() => {
            const newPath = goBackInPath(currentPath);
            setCurrentPath(newPath);
          }}
        />
      </View>
      {isLoading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      <ScrollView>
        {files?.folders.map((folder) => {
          return (
            <TouchableOpacity
              onPress={() => onNavigateForward(folder.path_lower)}
              key={folder.id}
            >
              <View className="p-3 border border-black flex-row items-center">
                <FolderClosedIcon />
                <Text className="ml-3 font-bold">{folder.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {files?.files.map((file) => {
          return (
            <TouchableOpacity key={file.id} onPress={() => testDownload(file)}>
              <View className="p-3 border border-red-700 flex-row items-center">
                <FileAudioIcon />
                <Text className="ml-3 text-red-700">{file.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ExplorerContainer;
function goBackInPath(path: string, delimiter: string = "/") {
  const lastSlash = path.lastIndexOf(delimiter);
  if (lastSlash < 0) {
    return "";
  }
  return path.slice(0, lastSlash);
}
