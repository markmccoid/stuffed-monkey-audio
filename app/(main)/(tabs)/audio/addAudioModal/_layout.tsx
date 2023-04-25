import * as React from "react";
import { Stack, Link, useNavigation, useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { MotiPressable } from "moti/interactions";

// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function AddAudioLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
          title: "Import",
          headerRight: () => (
            <>
              <Pressable onPress={() => router.back()}>
                <Text>Done</Text>
              </Pressable>
            </>
          ),
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
