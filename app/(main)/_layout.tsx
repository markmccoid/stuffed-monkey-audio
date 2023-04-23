import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import DrawerContents from "../../src/components/navHelpers/DrawerContents";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  const DrawerNavigator = () => {
    return (
      <Drawer
        // drawerContent={(props) => <DrawerContents {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#c6cbef",
            width: 240,
          },
        }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="settings" />
      </Drawer>
    );
  };
  console.log("drawer layout");
  return (
    <>
      <Drawer
        drawerContent={(props) => <DrawerContents {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#c6cbef",
            width: 240,
          },
        }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="settings" />
      </Drawer>
    </>
  );
}
