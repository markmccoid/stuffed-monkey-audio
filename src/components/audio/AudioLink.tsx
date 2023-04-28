import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import * as FileSystem from "expo-file-system";
import { colors } from "../../constants/Colors";

//------------------------------------------
//- DELETE File
//------------------------------------------
const deleteFile = async (
  file: string,
  setFiles: React.Dispatch<React.SetStateAction<never[]>>
) => {
  FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`);
  setFiles((prev) => prev.filter((prevFile) => prevFile !== file));
};

type Props = {
  title: string;
  linkURI: string;
  setFiles: React.Dispatch<React.SetStateAction<never[]>>; // This will ultimately not be needed when using jotai
};
const AudioLink = ({ title, linkURI, setFiles }: Props) => {
  return (
    <View style={styles.container}>
      <Link
        href={{
          pathname: linkURI,
          params: { folder: "" },
        }}
        style={styles.link}
      >
        <Text>{title}</Text>
      </Link>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFile(title, setFiles)}
      >
        <Text style={styles.linkText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,

    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  linkText: {
    color: "white",
  },
  deleteButton: {
    borderLeftWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    backgroundColor: colors.deleteRed,
  },
});
export default AudioLink;
