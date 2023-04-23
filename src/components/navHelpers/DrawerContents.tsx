import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, Linking, StyleSheet, Pressable } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MotiView, useDynamicAnimation } from "moti";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimateHeight } from "../animated/AnimatedHeight";
import { HomeIcon, SettingsIcon, UserIcon } from "../common/svg/Icons";
import Monkey from "../common/svg/Monkey";
import { colors } from "../../constants/Colors";
export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "rootscreen",
};

//-- --------------------------------------
//-- Custom Drawer content
//-- --------------------------------------

function CustomDrawerContent(props) {
  const router = useRouter();
  const [isVisibleOne, setIsVisibleOne] = useState(false);

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: colors.headerBG,
      }}
      contentContainerStyle={{ backgroundColor: colors.headerBG, flex: 1 }}
    >
      {/* <DrawerItem
        label="Website"
        onPress={() => Linking.openURL("https://www.expo.dev/")}
      /> */}
      <View style={styles.userInfo}>
        <Monkey
          style={{
            marginLeft: 15,
            marginRight: 10,
            paddingRight: 20,
            paddingTop: 10,
          }}
        />
        {/* <UserIcon
          size={20}
          color="blue"
          style={{ marginLeft: 20, paddingRight: 20, paddingTop: 10 }}
        /> */}
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <Text style={styles.userText}>{`Stuffed Monkey Audio`}</Text>
        </View>
      </View>
      {/* MENU Items AFTER Header */}
      <View
        style={{
          backgroundColor: colors.menuBG,
          flex: 1,
          flexDirection: "column",
          // borderWidth: 1,
          flexGrow: 1,
        }}
      >
        <View style={styles.menuItemStyle}>
          <DrawerItem
            label={({ focused, color }) => <Text style={{ color }}>Home</Text>}
            icon={({ focused, color, size }) => <HomeIcon size={size} />}
            onPress={() => {
              router.push("/audio");
              props.navigation.closeDrawer();
            }}
          />
        </View>

        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Settings"
            icon={({ focused, color, size }) => <SettingsIcon size={size} />}
            onPress={() => {
              router.push("/settings");
              props.navigation.closeDrawer();
            }}
          />
        </View>
        {/* COLLAPSABLE ONE */}
        <DrawerItem
          label={({ focused, color }) => (
            <Text style={{ color: "black" }}>Sort</Text>
          )}
          onPress={() => setIsVisibleOne((prev) => !prev)}
          activeTintColor="blue"
        />

        <AnimateHeight hide={!isVisibleOne} style={{ marginHorizontal: 15 }}>
          <View>
            <Text>HI</Text>
          </View>
        </AnimateHeight>
        {/* COLLAPSABLE ONE END */}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  menuItemStyle: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfo: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingVertical: 15,
    backgroundColor: "#fec872",
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    color: "#200018",
  },
});
export default CustomDrawerContent;
