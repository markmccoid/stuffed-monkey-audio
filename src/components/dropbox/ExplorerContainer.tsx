import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React from "react";
import { listDropboxFiles, DropboxDir } from "../../utils/dropboxUtils";
import ExplorerActionBar from "./ExplorerActionBar";
import { Link } from "expo-router";
import { FolderClosedIcon } from "../common/svg/Icons";
import { useTrackActions } from "../../store/store";
import ExplorerFile from "./ExplorerFile";
import ExplorerFolder from "./ExplorerFolder";

function filterAudioFiles(filesAndFolders: DropboxDir) {
  const files = filesAndFolders.files;
  const AUDIO_FORMATS = [
    "mp3",
    "mb4",
    "m4a",
    "m4b",
    "wav",
    "aiff",
    "aac",
    "ogg",
    "wma",
    "flac",
  ];
  const newFiles = files.filter((file) =>
    AUDIO_FORMATS.includes(file.name.slice(file.name.lastIndexOf(".") + 1))
  );
  return { folders: filesAndFolders.folders, files: newFiles };
}

const { height, width } = Dimensions.get("screen");

const ExplorerContainer = () => {
  const [files, setFiles] = React.useState<DropboxDir>();
  const [currentPath, setCurrentPath] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(undefined);
  const [progress, setProgress] = React.useState(0);
  const audioStoreActions = useTrackActions();

  React.useEffect(() => {
    const getFiles = async () => {
      setIsLoading(true);
      try {
        const files = await listDropboxFiles(currentPath);
        const filteredFiles = filterAudioFiles(files);
        setFiles(filteredFiles);
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

  // React.useEffect(() => {
  //   console.log("PROGRESS", progress);
  // }, [progress]);
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
    <View className="flex-1">
      <View style={{ zIndex: 5 }}>
        <ExplorerActionBar
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        // style={{ flex: 1 }}
      >
        {files?.folders.map((folder) => (
          <ExplorerFolder
            key={folder.id}
            folder={folder}
            onNavigateForward={onNavigateForward}
          />
        ))}
        {files?.files.map((file) => {
          return <ExplorerFile key={file.id} file={file} />;
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
