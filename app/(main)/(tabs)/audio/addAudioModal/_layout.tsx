import * as React from "react";
import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { MotiPressable } from "moti/interactions";

// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function AddAudioLayout() {
  const navigation = useNavigation();
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
          title: "Import",
        }}
      />
      <Stack.Screen
        name="importDropbox"
        options={{
          presentation: "card",
          title: "Dropbox",
        }}
      />
    </Stack>
  );
}
