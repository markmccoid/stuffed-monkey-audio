import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { drawerLeftMenu } from "../../../../src/components/navHelpers/headerHelpers";
// import { FilterIcon } from "../../../../utils/IconComponents";
// import { touchablePress } from "../../../../utils/pressableStyles";

export default function AddBooksLayout() {
  const navigation = useNavigation();
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Add Books",
          headerLeft: () => drawerLeftMenu(navigation, "stack"),
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Text>+</Text>
              </TouchableOpacity>
            );
          },
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
