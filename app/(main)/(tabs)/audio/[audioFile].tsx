import { View, Text } from "react-native";
import React from "react";
import { Stack, useNavigation } from "expo-router";

const AudioFile = () => {
  return (
    <View>
      <Stack screenOptions={{ title: "Options Set" }} />
      <Text>AudioFile</Text>
    </View>
  );
};

export default AudioFile;
