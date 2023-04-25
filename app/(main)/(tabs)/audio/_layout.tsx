import * as React from "react";
import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { MotiPressable } from "moti/interactions";
import { drawerLeftMenu } from "../../../../src/components/navHelpers/headerHelpers";
import {
  AddIcon,
  FilterIcon,
} from "../../../../src/components/common/svg/Icons";
import { HeaderIconPressable } from "../../../../src/components/common/buttons/Pressables";
import AddBook from "../../../../src/components/common/svg/AddBook";
// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function AudioListStack() {
  const navigation = useNavigation();
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Files",
          headerLeft: () => drawerLeftMenu(navigation, "stack"),
          headerRight: () => {
            return (
              <Link href="./audio/addAudioModal" asChild>
                <Pressable>
                  <AddBook size={25} />
                </Pressable>
                {/* <HeaderIconPressable>
                  <AddBook size={25} />
                </HeaderIconPressable> */}
              </Link>
            );
          },
        }}
      />
      <Stack.Screen name="[audioFile]" />
      <Stack.Screen
        name="addAudioModal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
