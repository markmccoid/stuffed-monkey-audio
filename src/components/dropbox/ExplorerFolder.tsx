import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FolderEntry } from "../../utils/dropboxUtils";
import { FolderClosedIcon } from "../common/svg/Icons";

type Props = {
  folder: FolderEntry;
  onNavigateForward: (path: string) => void;
};
const ExplorerFolder = ({ folder, onNavigateForward }: Props) => {
  return (
    <View className="p-2 border-b-amber-700 border-b">
      <TouchableOpacity
        onPress={() => onNavigateForward(folder.path_lower)}
        key={folder.id}
      >
        <View className="flex-row flex-grow items-center">
          <FolderClosedIcon color="#d97706" />
          <Text
            className="ml-3 flex-1 font-ssp_regular text-amber-950 text-base"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {folder.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExplorerFolder;
