import { Pressable } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { homeRoute } from "../../constants/routeContants";

type NavigatorType = "stack" | "tab" | "drawer";

export const drawerLeftMenu = (
  navigation,
  navigatorType: NavigatorType = "drawer"
) => {
  const marginLeft = 10; // navigatorType === "stack" ? -6 : 10;
  // const marginLeft = navigatorType === "stack" ? -6 : 10;
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

export const homeHeaderButton = (
  navigation,
  navigatorType: NavigatorType = "drawer"
) => {
  //const marginLeft = navigatorType === "stack" ? -6 : 10;

  return (
    <Link href={homeRoute} asChild>
      <Pressable>
        {({ pressed }) => (
          <FontAwesome
            name="home"
            size={25}
            color="blue"
            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
};
