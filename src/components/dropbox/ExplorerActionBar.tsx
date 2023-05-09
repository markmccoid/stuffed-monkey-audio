import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";

type Props = {
  currentPath: string;
  onHandleBack: () => void;
};
const ExplorerActionBar = ({ currentPath, onHandleBack }: Props) => {
  return (
    <View className="flex flex-col">
      <View className="flex flex-row items-center ">
        <TouchableOpacity
          disabled={currentPath.length === 0}
          onPress={onHandleBack}
          className="border border-black"
        >
          <Text className="px-4 py-2">Back</Text>
        </TouchableOpacity>
        <Text className="px-4 py-2 ">Favorites</Text>
      </View>
      <View>
        <Text className="text-sm font-ssp_regular text-amber-900 px-2 pt-1 pb-2">
          {currentPath.length === 0 ? "/" : currentPath}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
});
export default ExplorerActionBar;
