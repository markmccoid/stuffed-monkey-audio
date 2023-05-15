import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../../src/constants/Colors";
import { drawerLeftMenu } from "../../../src/components/navHelpers/headerHelpers";
import Headphone from "../../../src/components/common/svg/Headphones";
import { BookIcon, TagIcon } from "../../../src/components/common/svg/Icons";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ navigation, route }) => {
        // console.log("NAV", route);
        return {
          headerShown: false,
          // headerRight: () => homeHeaderButton(navigation, "stack"),
          // headerLeft: () => drawerLeftMenu(navigation, "stack"),
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        };
      }}
      initialRouteName="audio"
    >
      <Tabs.Screen
        name="audio"
        options={{
          title: "Audio",
          tabBarIcon: ({ color }) => <Headphone size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          title: "Tags",
          tabBarIcon: ({ color }) => <TagIcon size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addBooks"
        options={{
          title: "Add Books",
          tabBarIcon: ({ color }) => <BookIcon size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
