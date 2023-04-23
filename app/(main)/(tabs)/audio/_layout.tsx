import * as React from "react";
import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { MotiPressable } from "moti/interactions";
import { drawerLeftMenu } from "../../../../src/components/navHelpers/headerHelpers";
import { FilterIcon } from "../../../../src/components/common/svg/Icons";
import { HeaderIconPressable } from "../../../../src/components/common/buttons/Pressables";
// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function BookListStack() {
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
              <Link href="./audio/audioFilter" asChild>
                {/* <MotiPressable
                  animate={React.useMemo(
                    () =>
                      ({ hovered, pressed }) => {
                        "worklet";

                        return {
                          opacity: hovered || pressed ? 0.5 : 1,
                          transform: [{ scale: hovered || pressed ? 0.85 : 1 }],
                        };
                      },
                    []
                  )}
                > */}
                <HeaderIconPressable>
                  <FilterIcon />
                </HeaderIconPressable>
                {/* </MotiPressable> */}
              </Link>
            );
          },
        }}
      />
      <Stack.Screen name="[audioFile]" />
      <Stack.Screen name="audioFilter" options={{ presentation: "modal" }} />
    </Stack>
  );
}
