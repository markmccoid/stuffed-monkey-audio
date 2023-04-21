import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { drawerLeftMenu } from "../../../src/components/navHelpers/headerHelpers";
// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function BookListStack() {
  const navigation = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Files",
          headerLeft: () => drawerLeftMenu(navigation, "stack"),
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Link href="./home/audioFilter">
                  {/* <FilterIcon /> */}
                  <Text>F</Text>
                </Link>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen name="[audioFile]" />
      <Stack.Screen name="audioFilter" options={{ presentation: "modal" }} />
    </Stack>
  );
}
