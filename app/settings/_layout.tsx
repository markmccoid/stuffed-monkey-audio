import { View, Text, Pressable } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// import { drawerLeftMenu, homeHeaderButton } from "../../../utils/drawerHelpers";

export const drawerLeftMenu = (
  navigation,
  navigatorType: NavigatorType = "drawer"
) => {
  const marginLeft = navigatorType === "stack" ? -6 : 10;
  return (
    <Pressable onPress={() => navigation.openDrawer()}>
      {({ pressed }) => (
        <Ionicons
          name="ios-menu"
          size={25}
          color="black"
          style={{ marginLeft: marginLeft, opacity: pressed ? 0.7 : 1 }}
        />
      )}
    </Pressable>
  );
};

const SettingsScreenLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={({ navigation }) => ({
        // headerRight: () => homeHeaderButton(navigation, "stack"),
        headerLeft: () => drawerLeftMenu(navigation, "stack"),
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings Drawer",
        }}
      />
      <Stack.Screen
        name="dropboxAuth"
        options={{
          headerLeft: () => {
            return null;
          },
        }}
      />
    </Stack>
  );
};

export default SettingsScreenLayout;
