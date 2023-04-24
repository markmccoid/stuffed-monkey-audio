import { Pressable } from "react-native";
import { MotiPressable } from "moti/interactions";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { homeRoute } from "../../constants/routeContants";
import { HeaderIconPressable } from "../common/buttons/Pressables";
import { DrawerMenuIcon } from "../common/svg/Icons";

type NavigatorType = "stack" | "tab" | "drawer";

export const drawerLeftMenu = (
  navigation,
  navigatorType: NavigatorType = "drawer"
) => {
  const marginLeft = navigatorType === "stack" ? -6 : 10;
  // const marginLeft = navigatorType === "stack" ? -6 : 10;
  return (
    <Pressable onPress={() => navigation.openDrawer()}>
      <DrawerMenuIcon size={25} />
    </Pressable>
    // <HeaderIconPressable onPress={() => navigation.openDrawer()}>
    //   <DrawerMenuIcon size={25} />
    // </HeaderIconPressable>
  );
};

export const homeHeaderButton = (
  navigation,
  navigatorType: NavigatorType = "drawer"
) => {
  //const marginLeft = navigatorType === "stack" ? -6 : 10;

  return (
    <Link href={homeRoute} replace asChild>
      <Pressable>
        <FontAwesome name="home" size={25} color="blue" />
      </Pressable>
      {/* <HeaderIconPressable>
        <FontAwesome name="home" size={25} color="blue" />
      </HeaderIconPressable> */}
    </Link>
  );
};
